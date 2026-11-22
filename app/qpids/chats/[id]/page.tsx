"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, type Conversation } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { qp } from "../../lib/paths";
import Avatar from "../../Avatar";

type Msg = { id: string | number; mine: boolean; senderName: string; kind: string; body: string; createdAt: string };

// Chats share the same transport as the Cupid's Corner app, so a message sent
// here shows up there instantly. When the backend has Stream configured,
// one-to-one chats use Stream channel "conv-<id>". Cupid (the AI coach) and
// backends without Stream use the local messages API with polling.

function fromStream(m: any, myId: number): Msg {
  return {
    id: m.id,
    mine: m.user?.id === String(myId),
    senderName: m.user?.name || "",
    kind: m.messageKind || (m.user?.id === "cupids-corner-system" ? "system" : "text"),
    body: m.text || "",
    createdAt: m.created_at ? new Date(m.created_at).toISOString() : new Date().toISOString(),
  };
}

export default function ChatThread() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [conv, setConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState<"pending" | "stream" | "local">("pending");
  const channelRef = useRef<any>(null);
  const lastId = useRef(0);
  const bottom = useRef<HTMLDivElement>(null);

  const append = useCallback((incoming: Msg[]) => {
    setMessages((list) => {
      const seen = new Set(list.map((m) => m.id));
      const added = incoming.filter((m) => !seen.has(m.id));
      return added.length ? [...list, ...added] : list;
    });
  }, []);

  useEffect(() => {
    api<{ conversation: Conversation }>(`/conversations/${id}`)
      .then((r) => setConv(r.conversation))
      .catch((e) => setError(e.message));
  }, [id]);

  // Pick the transport once we know the chat type.
  useEffect(() => {
    if (!conv || !user) return;
    if (conv.type === "ai") {
      setMode("local");
      return;
    }
    let alive = true;
    let client: any = null;
    (async () => {
      try {
        const creds = await api<{ apiKey: string; userId: number; chatToken: string }>("/stream/credentials");
        const { StreamChat } = await import("stream-chat");
        client = StreamChat.getInstance(creds.apiKey);
        if (!client.userID) await client.connectUser({ id: String(creds.userId) }, creds.chatToken);
        const channel = client.channel("messaging", `conv-${id}`);
        await channel.watch();
        if (!alive) return;
        channelRef.current = channel;
        setMessages(channel.state.messages.map((m: any) => fromStream(m, user.id)));
        channel.on("message.new", (e: any) => alive && append([fromStream(e.message, user.id)]));
        channel.markRead().catch(() => {});
        setMode("stream");
      } catch {
        if (alive) setMode("local");
      }
    })();
    return () => {
      alive = false;
      channelRef.current?.stopWatching().catch(() => {});
      channelRef.current = null;
      client?.disconnectUser().catch(() => {});
    };
  }, [conv, user, id, append]);

  const poll = useCallback(async () => {
    try {
      const r = await api<{ messages: (Msg & { id: number })[] }>(`/conversations/${id}/messages?after=${lastId.current}`);
      if (r.messages.length) {
        lastId.current = r.messages[r.messages.length - 1].id;
        append(r.messages);
      }
    } catch (e: any) {
      setError(e.message);
    }
  }, [id, append]);

  useEffect(() => {
    if (mode !== "local") return;
    poll();
    const t = setInterval(poll, 3000);
    return () => clearInterval(t);
  }, [mode, poll]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setError("");
    try {
      if (mode === "stream" && channelRef.current) {
        const res = await channelRef.current.sendMessage({ text: body });
        if (res.message.type === "error") throw new Error("This chat is unavailable.");
        append([fromStream(res.message, user!.id)]);
      } else {
        await api(`/conversations/${id}/messages`, { method: "POST", body: { body } });
        await poll();
      }
      setDraft("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  const isAI = conv?.type === "ai";
  const title = isAI ? "Cupid, your dating coach" : conv?.title || "Chat";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4" style={{ minHeight: "calc(100vh - 220px)" }}>
      <div className="flex items-center gap-3">
        <Link href={qp("chats")} className="qp-btn qp-btn-ghost px-3 py-2 text-sm" aria-label="Back to chats">
          ←
        </Link>
        {conv && <Avatar name={title} photoUrl={conv.photoUrl} emoji={conv.emoji} color={conv.color} size={44} />}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {error && <p className="qp-error" role="alert">{error}</p>}

      <div className="qp-card flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: "60vh" }} aria-live="polite">
        {mode === "pending" ? (
          <p className="qp-muted py-8 text-center">Opening your chat…</p>
        ) : messages.length === 0 ? (
          <p className="qp-muted py-8 text-center">
            {isAI ? "Ask Cupid for an opener, a date idea, or a second opinion." : "No messages yet. A simple hello works."}
          </p>
        ) : (
          messages.map((m) =>
            m.kind === "system" ? (
              <p key={m.id} className="qp-muted text-center text-sm">{m.body}</p>
            ) : (
              <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[80%] rounded-3xl px-4 py-2"
                  style={
                    m.mine
                      ? { background: "var(--qp-coral)", color: "#fff", borderBottomRightRadius: 8 }
                      : { background: "var(--qp-bg)", borderBottomLeftRadius: 8 }
                  }
                >
                  {!m.mine && <p className="text-xs font-semibold opacity-70">{m.senderName}</p>}
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                </div>
              </div>
            )
          )
        )}
        <div ref={bottom} />
      </div>

      <form onSubmit={send} className="flex gap-2">
        <label htmlFor="msg" className="sr-only">Message</label>
        <input
          id="msg"
          className="qp-input"
          placeholder={isAI ? "Ask Cupid anything" : "Write a message"}
          maxLength={4000}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={mode === "pending"}
        />
        <button className="qp-btn qp-btn-primary" disabled={sending || !draft.trim() || mode === "pending"}>
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
