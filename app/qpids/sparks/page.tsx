"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { inAndroidApp } from "../lib/native";
import { qp } from "../lib/paths";

// Sparks are the shared currency across every brand on the backend. Buying
// goes through the backend's Stripe checkout, which sends the member back
// here with ?status=success or ?status=cancelled.

type Pack = { key: string; sparks: number; price: number; label: string };

function SparksInner() {
  const { user, refresh } = useAuth();
  const status = useSearchParams().get("status");
  const [data, setData] = useState<{ configured: boolean; packs: Pack[] } | null>(null);
  const [buying, setBuying] = useState("");
  const [error, setError] = useState("");
  // Google Play has its own rules for selling in-app currency, so the app
  // build does not open the card checkout. Balances and spending work as usual.
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    if (inAndroidApp()) {
      setInApp(true);
      return;
    }
    api<{ configured: boolean; packs: Pack[] }>("/billing/packs").then(setData).catch((e) => setError(e.message));
  }, []);

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

      {inApp ? (
        <div className="qp-card p-6 text-center">
          <p className="qp-serif text-xl font-bold">Not in the app yet</p>
          <p className="qp-muted">Buying sparks isn't available in the Android app yet. Everything you already have works here.</p>
        </div>
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
