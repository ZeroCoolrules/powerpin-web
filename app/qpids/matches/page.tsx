"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type Member } from "../lib/api";
import { qp } from "../lib/paths";
import Avatar from "../Avatar";

type MatchRow = { user: Member; matchedAt: string; conversationId: number | null };
type Likes = { count: number; locked: boolean; profiles: Member[] };

export default function Matches() {
  const [matches, setMatches] = useState<MatchRow[] | null>(null);
  const [likes, setLikes] = useState<Likes | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ matches: MatchRow[] }>("/matches")
      .then((r) => setMatches(r.matches.filter((m) => m.user)))
      .catch((e) => setError(e.message));
    api<Likes>("/likes").then(setLikes).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Matches</h1>
      {error && <p className="qp-error" role="alert">{error}</p>}

      {likes && likes.count > 0 && (
        <section className="qp-card flex items-center justify-between gap-4 p-5" style={{ background: "var(--qp-blush)" }}>
          <div>
            <p className="qp-serif text-xl font-bold">
              {likes.count} {likes.count === 1 ? "person likes" : "people like"} you
            </p>
            <p className="qp-muted text-sm">
              {likes.locked ? "Like them back in Discover to match, or go Premium to see who they are." : "Like them back to start chatting."}
            </p>
          </div>
          {!likes.locked && (
            <div className="flex -space-x-3">
              {likes.profiles.slice(0, 4).map((p) => (
                <Avatar key={p.id} name={p.displayName} photoUrl={p.photoUrl} emoji={p.avatarEmoji} color={p.avatarColor} size={44} />
              ))}
            </div>
          )}
        </section>
      )}

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
              <Avatar name={m.user.displayName} photoUrl={m.user.photoUrl} emoji={m.user.avatarEmoji} color={m.user.avatarColor} size={56} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">
                  {m.user.displayName}, {m.user.age}
                </p>
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
    </div>
  );
}
