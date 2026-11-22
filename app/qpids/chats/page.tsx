"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type Conversation } from "../lib/api";
import { qp } from "../lib/paths";
import Avatar from "../Avatar";

export default function Chats() {
  const [list, setList] = useState<Conversation[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Qpids Place shows one-to-one chats and Cupid, the AI matchmaker.
    api<{ conversations: Conversation[] }>("/conversations")
      .then((r) => setList(r.conversations.filter((c) => c.type === "dm" || c.type === "ai")))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold">Chats</h1>
      {error && <p className="qp-error" role="alert">{error}</p>}
      {list === null ? (
        <p className="qp-muted">Loading…</p>
      ) : list.length === 0 ? (
        <p className="qp-muted">No chats yet. When you match with someone, your chat appears here.</p>
      ) : (
        <ul className="qp-card divide-y" style={{ borderColor: "var(--qp-line)" }}>
          {list.map((c) => (
            <li key={c.id}>
              <Link href={qp(`chats/${c.id}`)} className="flex items-center gap-4 p-4 hover:bg-[var(--qp-bg)]">
                <Avatar name={c.title} photoUrl={c.photoUrl} emoji={c.emoji} color={c.color} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{c.type === "ai" ? "Cupid, your dating coach" : c.title}</p>
                  <p className="qp-muted truncate text-sm">{c.lastMessage?.body || "Say hello"}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
