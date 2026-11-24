"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api, type Member } from "../lib/api";
import { useAuth } from "../lib/auth";
import type { Winks } from "../lib/extras";
import { qp } from "../lib/paths";
import Avatar from "../Avatar";

type MatchRow = { user: Member; matchedAt: string; conversationId: number | null };
type Likes = { count: number; locked: boolean; profiles: Member[] };

export default function Matches() {
  const { setUser } = useAuth();
  const [matches, setMatches] = useState<MatchRow[] | null>(null);
  const [likes, setLikes] = useState<Likes | null>(null);
  const [winks, setWinks] = useState<Winks | null>(null);
  const [error, setError] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadLikes = useCallback(() => api<Likes>("/likes").then(setLikes).catch(() => {}), []);
  const loadWinks = useCallback(() => api<Winks>("/winks").then(setWinks).catch(() => {}), []);

  useEffect(() => {
    api<{ matches: MatchRow[] }>("/matches")
      .then((r) => setMatches(r.matches.filter((m) => m.user)))
      .catch((e) => setError(e.message));
    loadLikes();
    loadWinks();
  }, [loadLikes, loadWinks]);

  // Premium is paid for with sparks. It shows who likes you and raises the daily wink limit.
  async function goPremium() {
    setBusy(true);
    setUnlockError("");
    try {
      const { user } = await api<{ user: Member }>("/me/premium", { method: "POST" });
      setUser(user);
      await Promise.all([loadLikes(), loadWinks()]);
    } catch (err: any) {
      setUnlockError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function winkBack(id: number) {
    setError("");
    try {
      await api(`/users/${id}/wink`, { method: "POST" });
      await loadWinks();
    } catch (err: any) {
      setError(err.message);
    }
  }

  const premium = winks?.premium;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Matches</h1>
      {error && <p className="qp-error" role="alert">{error}</p>}

      {likes && likes.count > 0 && (
        <section className="qp-card space-y-3 p-5" style={{ background: "var(--qp-blush)" }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                {likes.count} {likes.count === 1 ? "person likes" : "people like"} you
              </h2>
              <p className="qp-muted text-sm">
                {likes.locked ? "Like them back in Discover to match, or go Premium to see who they are." : "Open a profile, then like them back in Discover to start chatting."}
              </p>
            </div>
            {likes.locked && (
              <button className="qp-btn qp-btn-primary shrink-0 px-4 py-2 text-sm" onClick={goPremium} disabled={busy}>
                {busy ? "One moment…" : premium ? `See who for ✨ ${premium.cost}` : "See who"}
              </button>
            )}
          </div>
          {likes.locked && premium && (
            <p className="qp-muted text-sm">
              Premium lasts {premium.days} days and also gives you {winks?.limits.premium} winks a day.
            </p>
          )}
          {unlockError && (
            <p className="qp-error" role="alert">
              {unlockError} <Link href={qp("sparks")} className="font-semibold underline">Get sparks</Link>
            </p>
          )}
          {!likes.locked && (
            <ul className="flex flex-wrap gap-3">
              {likes.profiles.map((p) => (
                <li key={p.id}>
                  <Link href={qp(`members/${p.id}`)} className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-4">
                    <Avatar name={p.displayName} photoUrl={p.photoUrl} emoji={p.avatarEmoji} color={p.avatarColor} size={40} />
                    <span className="font-semibold">{p.displayName}, {p.age}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {winks && winks.winks.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl font-bold">Winks</h2>
            <p className="qp-muted text-sm">
              {winks.allowance.left} of your {winks.allowance.limit} winks left today
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {winks.winks.map((w) => (
              <li key={w.user.id} className="qp-card flex items-center gap-4 p-4">
                <Link href={qp(`members/${w.user.id}`)} className="shrink-0">
                  <Avatar name={w.user.displayName} photoUrl={w.user.photoUrl} emoji={w.user.avatarEmoji} color={w.user.avatarColor} size={56} />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={qp(`members/${w.user.id}`)} className="block truncate font-bold">
                    {w.user.displayName}, {w.user.age}
                  </Link>
                  <p className="qp-muted truncate text-sm">
                    {w.isNew ? "New wink" : "Winked at you"}
                    {w.times > 1 ? ` · ${w.times} times` : ""}
                  </p>
                </div>
                <button className="qp-btn qp-btn-ghost px-3 py-2 text-sm" onClick={() => winkBack(w.user.id)} disabled={w.winkedBackToday}>
                  {w.winkedBackToday ? "Winked" : "😉 Wink back"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        {(likes?.count || winks?.winks.length) ? <h2 className="text-2xl font-bold">Your matches</h2> : null}
        {matches === null ? (
          <p className="qp-muted">Loading…</p>
        ) : matches.length === 0 ? (
          <div className="qp-card p-8 text-center">
            <p className="qp-muted mb-4">No matches yet. Like a few people in Discover and they will show up here.</p>
            <Link href={qp("discover")} className="qp-btn qp-btn-primary">Go to Discover</Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {matches.map((m) => (
              <li key={m.user.id} className="qp-card flex items-center gap-4 p-4">
                <Link href={qp(`members/${m.user.id}`)} className="shrink-0">
                  <Avatar name={m.user.displayName} photoUrl={m.user.photoUrl} emoji={m.user.avatarEmoji} color={m.user.avatarColor} size={56} />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={qp(`members/${m.user.id}`)} className="block truncate font-bold">
                    {m.user.displayName}, {m.user.age}
                  </Link>
                  <p className="qp-muted truncate text-sm">{m.user.city || "Matched"}</p>
                </div>
                {m.conversationId && (
                  <Link href={qp(`chats/${m.conversationId}`)} className="qp-btn qp-btn-primary px-4 py-2 text-sm">
                    Chat
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
