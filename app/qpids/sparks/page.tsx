"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { inAndroidApp, isPlayCancel, playStore, type PlayPurchase } from "../lib/native";
import { qp } from "../lib/paths";

// Sparks are the shared currency across every brand on the backend. Buying
// goes through the backend's Stripe checkout, which sends the member back
// here with ?status=success or ?status=cancelled.
//
// Inside the Android app, Google Play sells the packs instead: the app shows
// Google's purchase sheet, and the backend confirms each purchase with Google
// before adding sparks.

type Pack = { key: string; sparks: number; price: number; label: string };
type PlayPack = Pack & { productId: string; playPrice?: string };
type Redeemed = { ok: boolean; added: number; pending: boolean; message?: string };

function SparksInner() {
  const { user, refresh } = useAuth();
  const status = useSearchParams().get("status");
  const [data, setData] = useState<{ configured: boolean; packs: Pack[] } | null>(null);
  const [buying, setBuying] = useState("");
  const [error, setError] = useState("");
  // Inside the app the packs come from Google Play, not the card checkout.
  const [inApp, setInApp] = useState(false);
  const [play, setPlay] = useState<{ ready: boolean; token: string; packs: PlayPack[] } | null>(null);
  const [notice, setNotice] = useState("");

  // Hands one Google purchase to the backend, which checks it with Google and
  // adds the sparks once. Sending the same purchase twice is harmless.
  const redeem = useCallback(
    async (p: PlayPurchase) => {
      const purchaseToken = p.purchaseToken || p.transactionId;
      if (!purchaseToken) return null;
      const r = await api<Redeemed>("/billing/play/redeem", {
        method: "POST",
        body: { productId: p.productIdentifier, purchaseToken },
      });
      if (r.added > 0) {
        setNotice(`${r.added.toLocaleString()} sparks added.`);
        await refresh();
      } else if (r.pending) {
        setNotice(r.message || "Your payment is still pending. Sparks arrive once it clears.");
      }
      return r;
    },
    [refresh],
  );

  useEffect(() => {
    if (!inAndroidApp()) {
      api<{ configured: boolean; packs: Pack[] }>("/billing/packs").then(setData).catch((e) => setError(e.message));
      return;
    }
    setInApp(true);
    let gone = false;
    (async () => {
      const store = playStore();
      try {
        const info = await api<{ configured: boolean; accountToken: string; packs: PlayPack[] }>("/billing/play");
        const supported = !!store && info.configured && (await store.isBillingSupported()).isBillingSupported;
        if (!store || !supported) {
          if (!gone) setPlay({ ready: false, token: "", packs: [] });
          return;
        }
        // Show Google's own price for each pack, and only packs Google knows.
        const { products } = await store.getProducts({
          productIdentifiers: info.packs.map((p) => p.productId),
          productType: "inapp",
        });
        const priceOf = new Map(products.map((p) => [p.identifier, p.priceString]));
        const packs = info.packs.filter((p) => priceOf.has(p.productId)).map((p) => ({ ...p, playPrice: priceOf.get(p.productId) }));
        if (!gone) setPlay({ ready: packs.length > 0, token: info.accountToken, packs });
        // Finish anything paid for earlier that never reached the backend
        // (the app was closed, the connection dropped).
        const { purchases } = await store.getPurchases({ productType: "inapp" });
        for (const p of purchases) await redeem(p).catch(() => null);
      } catch {
        if (!gone) setPlay((cur) => cur ?? { ready: false, token: "", packs: [] });
      }
    })();
    return () => {
      gone = true;
    };
  }, [redeem]);

  async function buyInApp(pack: PlayPack) {
    const store = playStore();
    if (!store || !play) return;
    setBuying(pack.key);
    setError("");
    setNotice("");
    try {
      // Not finished on the phone: the backend marks it used after adding the
      // sparks, so a purchase can't be lost between the two.
      const purchase = await store.purchaseProduct({
        productIdentifier: pack.productId,
        productType: "inapp",
        appAccountToken: play.token,
        isConsumable: false,
        autoAcknowledgePurchases: false,
      });
      const r = await redeem({ ...purchase, productIdentifier: purchase.productIdentifier || pack.productId });
      if (!r) setError("Google Play didn't return a purchase. You weren't charged.");
    } catch (err: any) {
      if (!isPlayCancel(err)) {
        setError(`${err?.message || "The purchase didn't go through."} If you were charged, your sparks will appear when you reopen this page.`);
      }
    } finally {
      setBuying("");
    }
  }

  // The payment confirmation can land a moment after the redirect.
  useEffect(() => {
    if (status !== "success") return;
    let tries = 0;
    const t = setInterval(() => {
      tries += 1;
      refresh();
      if (tries >= 5) clearInterval(t);
    }, 1500);
    return () => clearInterval(t);
  }, [status, refresh]);

  async function buy(pack: Pack) {
    setBuying(pack.key);
    setError("");
    try {
      const { url } = await api<{ url: string }>("/billing/checkout", { method: "POST", body: { packKey: pack.key } });
      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
      setBuying("");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sparks</h1>
        <p className="qp-muted">Sparks pay for coach sessions with Cupid and other extras.</p>
      </div>

      <section className="qp-card flex items-center justify-between p-5">
        <p className="font-bold">Your balance</p>
        <p className="qp-serif text-2xl font-bold">{(user?.sparks ?? 0).toLocaleString()}</p>
      </section>

      {status === "success" && (
        <p role="status" className="font-semibold" style={{ color: "var(--qp-teal)" }}>
          Payment received. Your sparks will show up in a moment.{" "}
          <Link href={qp("coach")} className="underline">Back to Cupid</Link>
        </p>
      )}
      {status === "cancelled" && <p className="qp-muted" role="status">Checkout cancelled. You weren't charged.</p>}
      {error && <p className="qp-error" role="alert">{error}</p>}

      {notice && <p role="status" className="font-semibold" style={{ color: "var(--qp-teal)" }}>{notice}</p>}

      {inApp ? (
        !play ? (
          <p className="qp-muted">Loading…</p>
        ) : !play.ready ? (
          <div className="qp-card p-6 text-center">
            <p className="qp-serif text-xl font-bold">Almost ready</p>
            <p className="qp-muted">Buying sparks isn't open in the app yet. Everything you already have works here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {play.packs.map((p) => (
              <button
                key={p.key}
                className="qp-card flex w-full items-center justify-between p-5 text-left"
                disabled={!!buying}
                onClick={() => buyInApp(p)}
              >
                <span>
                  <span className="block font-bold">{p.sparks.toLocaleString()} sparks</span>
                  <span className="qp-muted block text-sm">One-time purchase through Google Play</span>
                </span>
                <span className="qp-btn qp-btn-primary py-2">{buying === p.key ? "Opening…" : p.playPrice}</span>
              </button>
            ))}
          </div>
        )
      ) : !data ? (
        !error && <p className="qp-muted">Loading…</p>
      ) : !data.configured ? (
        <div className="qp-card p-6 text-center">
          <p className="qp-serif text-xl font-bold">Almost ready</p>
          <p className="qp-muted">Buying sparks isn't open yet. Check back soon.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.packs.map((p) => (
            <button
              key={p.key}
              className="qp-card flex w-full items-center justify-between p-5 text-left"
              disabled={!!buying}
              onClick={() => buy(p)}
            >
              <span>
                <span className="block font-bold">{p.sparks.toLocaleString()} sparks</span>
                <span className="qp-muted block text-sm">One-time purchase</span>
              </span>
              <span className="qp-btn qp-btn-primary py-2">{buying === p.key ? "Opening…" : `$${(p.price / 100).toFixed(2)}`}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SparksPage() {
  return (
    <Suspense fallback={<p className="qp-muted">Loading…</p>}>
      <SparksInner />
    </Suspense>
  );
}
