"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api, mediaUrl, type Member } from "../lib/api";
import { qp } from "../lib/paths";

type SwipeResult = { matched: boolean; conversationId: number | null; target: Member };

export default function Discover() {
  const [deck, setDeck] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [match, setMatch] = useState<SwipeResult | null>(null);
  const [interest, setInterest] = useState("");
  const [sameCity, setSameCity] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (interest.trim()) params.set("interest", interest.trim());
    if (sameCity) params.set("sameCity", "1");
    try {
      const { profiles } = await api<{ profiles: Member[] }>(`/discover${params.size ? `?${params}` : ""}`);
      setDeck(profiles);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [interest, sameCity]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sameCity]);

  async function swipe(direction: "like" | "pass") {
    const current = deck[0];
    if (!current || busy) return;
    setBusy(true);
    try {
      const result = await api<SwipeResult>("/swipe", { method: "POST", body: { targetId: current.id, direction } });
      setDeck((d) => d.slice(1));
      if (result.matched) setMatch(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const current = deck[0];
  const photo = mediaUrl(current?.photoUrl);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-end justify-between gap-3">
        <h1 className="text-3xl font-bold">Discover</h1>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sameCity} onChange={(e) => setSameCity(e.target.checked)} />
          Near me
        </label>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
        className="flex gap-2"
      >
        <input className="qp-input" placeholder="Filter by an interest, like hiking" value={interest} onChange={(e) => setInterest(e.target.value)} />
        <button className="qp-btn qp-btn-ghost py-2">Filter</button>
      </form>

      {error && <p className="qp-error" role="alert">{error}</p>}

      {loading ? (
        <p className="qp-muted py-16 text-center">Finding people for you…</p>
      ) : !current ? (
        <div className="qp-card space-y-3 p-8 text-center">
          <p className="text-4xl">🌷</p>
          <h2 className="text-xl font-bold">You've seen everyone for now</h2>
          <p className="qp-muted">New people join every day. Try another interest, or check back later.</p>
          <button className="qp-btn qp-btn-ghost" onClick={() => { setInterest(""); load(); }}>
            Refresh
          </button>
        </div>
      ) : (
        <article className="qp-card overflow-hidden">
          <div className="relative flex aspect-[4/5] items-center justify-center" style={{ background: current.avatarColor || "var(--qp-blush)" }}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={current.displayName} className="h-full w-full object-cover" />
            ) : (
              <span className="text-8xl" aria-hidden="true">{current.avatarEmoji}</span>
            )}
            {current.match && (
              <span className="qp-chip qp-chip-teal absolute left-4 top-4 font-semibold">{current.match.percent}% match</span>
            )}
          </div>
          <div className="space-y-3 p-5">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">
                {current.displayName}, {current.age}
              </h2>
              {current.isVerified && <span className="qp-chip qp-chip-teal">Verified</span>}
            </div>
            {current.city && <p className="qp-muted">{current.city}</p>}
            {current.bio && <p>{current.bio}</p>}
            {current.prompts?.slice(0, 2).map((p) => (
              <div key={p.question} className="rounded-2xl p-3" style={{ background: "var(--qp-bg)" }}>
                <p className="qp-muted text-sm">{p.question}</p>
                <p className="qp-serif text-lg">{p.answer}</p>
              </div>
            ))}
            {current.interests?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {current.interests.map((i) => (
                  <span key={i} className="qp-chip">{i}</span>
                ))}
              </div>
            )}
            {current.match?.reasons?.length ? (
              <p className="qp-muted text-sm">Why you might click: {current.match.reasons.join(", ")}</p>
            ) : null}
            <Link href={qp(`members/${current.id}`)} className="inline-block text-sm font-semibold underline" style={{ color: "var(--qp-teal)" }}>
              See full profile and photos
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 p-5 pt-0">
            <button className="qp-btn qp-btn-ghost" disabled={busy} onClick={() => swipe("pass")}>
              Not for me
            </button>
            <button className="qp-btn qp-btn-primary" disabled={busy} onClick={() => swipe("like")}>
              ♥ Like
            </button>
          </div>
        </article>
      )}

      {match && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4" style={{ background: "rgba(43,29,42,0.45)" }} role="dialog" aria-modal="true" aria-labelledby="match-title">
          <div className="qp-card w-full max-w-sm space-y-4 p-8 text-center">
            <p className="text-5xl">💞</p>
            <h2 id="match-title" className="text-3xl font-bold">It's a match!</h2>
            <p className="qp-muted">You and {match.target.displayName} like each other.</p>
            <div className="flex flex-col gap-2">
              {match.conversationId && (
                <Link href={qp(`chats/${match.conversationId}`)} className="qp-btn qp-btn-primary">
                  Say hello
                </Link>
              )}
              <button className="qp-btn qp-btn-ghost" onClick={() => setMatch(null)}>
                Keep discovering
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
