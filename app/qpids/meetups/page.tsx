"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { timeRange, type Meetup } from "../lib/extras";
import { qp } from "../lib/paths";
import Avatar from "../Avatar";

type Limits = { active: number; spots: number; daysAhead: number; hours: number };

// A value for <input type="datetime-local"> in the reader's own time zone.
function localInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function PostForm({ limits, onPosted, onCancel }: { limits: Limits | null; onPosted: () => void; onCancel: () => void }) {
  const soon = new Date(Date.now() + 24 * 3600_000);
  soon.setMinutes(0, 0, 0);
  const [form, setForm] = useState({
    title: "",
    details: "",
    area: "",
    city: "",
    place: "",
    startsAt: localInput(soon),
    endsAt: localInput(new Date(soon.getTime() + 2 * 3600_000)),
    spots: "1",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/meetups", {
        method: "POST",
        body: { ...form, spots: Number(form.spots), startsAt: new Date(form.startsAt).toISOString(), endsAt: new Date(form.endsAt).toISOString() },
      });
      onPosted();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="qp-card space-y-4 p-5">
      <h2 className="text-xl font-bold">Post a meetup</h2>
      <div>
        <label className="qp-label" htmlFor="mu-title">What would you like to do?</label>
        <input id="mu-title" className="qp-input" required maxLength={80} value={form.title} onChange={set("title")} placeholder="Coffee and a walk by the river" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="qp-label" htmlFor="mu-start">I'm free from</label>
          <input id="mu-start" className="qp-input" type="datetime-local" required value={form.startsAt} onChange={set("startsAt")} />
        </div>
        <div>
          <label className="qp-label" htmlFor="mu-end">Until</label>
          <input id="mu-end" className="qp-input" type="datetime-local" required value={form.endsAt} onChange={set("endsAt")} />
        </div>
        <div>
          <label className="qp-label" htmlFor="mu-city">City</label>
          <input id="mu-city" className="qp-input" maxLength={60} value={form.city} onChange={set("city")} placeholder="Leave blank to use your profile city" />
        </div>
        <div>
          <label className="qp-label" htmlFor="mu-area">General area</label>
          <input id="mu-area" className="qp-input" required maxLength={60} value={form.area} onChange={set("area")} placeholder="Downtown, near the river" />
        </div>
      </div>
      <div>
        <label className="qp-label" htmlFor="mu-place">Exact place (private)</label>
        <input id="mu-place" className="qp-input" maxLength={200} value={form.place} onChange={set("place")} placeholder="Name of the café or park entrance" />
        <p className="qp-muted mt-1 text-sm">Only people you accept can see this. Everyone else sees the general area. Pick somewhere public.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <div>
          <label className="qp-label" htmlFor="mu-details">Anything else? (optional)</label>
          <textarea id="mu-details" className="qp-input" maxLength={600} value={form.details} onChange={set("details")} placeholder="Easygoing, happy to chat about anything." />
        </div>
        <div>
          <label className="qp-label" htmlFor="mu-spots">How many people?</label>
          <select id="mu-spots" className="qp-input" value={form.spots} onChange={set("spots")}>
            {Array.from({ length: limits?.spots || 10 }, (_, i) => i + 1).map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
      </div>
      {error && <p className="qp-error" role="alert">{error}</p>}
      <div className="flex gap-3">
        <button className="qp-btn qp-btn-primary" disabled={busy}>{busy ? "Posting…" : "Post meetup"}</button>
        <button type="button" className="qp-btn qp-btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function Card({ meetup, onChanged }: { meetup: Meetup; onChanged: () => void }) {
  const [m, setM] = useState(meetup);
  const [open, setOpen] = useState(false);
  const [asking, setAsking] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [chat, setChat] = useState<number | null>(null);
  useEffect(() => setM(meetup), [meetup]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const reload = async () => setM((await api<{ meetup: Meetup }>(`/meetups/${m.id}`)).meetup);

  const ask = () =>
    run(async () => {
      await api(`/meetups/${m.id}/join`, { method: "POST", body: { note } });
      setAsking(false);
      await reload();
    });
  const withdraw = () =>
    run(async () => {
      await api(`/meetups/${m.id}/join`, { method: "DELETE" });
      await reload();
    });
  const manage = () =>
    run(async () => {
      if (!open) await reload();
      setOpen(!open);
    });
  const decide = (requestId: number, accept: boolean) =>
    run(async () => {
      const r = await api<{ meetup: Meetup; conversationId: number | null }>(`/meetups/${m.id}/requests/${requestId}`, { method: "POST", body: { accept } });
      setM(r.meetup);
      if (r.conversationId) setChat(r.conversationId);
    });
  const cancel = () => {
    if (!window.confirm("Cancel this meetup? Anyone who asked to join will see it's off.")) return;
    run(async () => {
      await api(`/meetups/${m.id}`, { method: "DELETE" });
      onChanged();
    });
  };
  const report = () => {
    const reason = window.prompt("What's wrong with this meetup? Our team will take a look.");
    if (reason === null) return;
    run(async () => {
      await api(`/meetups/${m.id}/report`, { method: "POST", body: { reason } });
      setNotice("Thanks. We've sent this to our team.");
    });
  };

  const host = m.host;
  const full = m.spotsLeft === 0;

  return (
    <li className="qp-card space-y-3 p-5">
      <div className="flex items-start gap-3">
        {host && (
          <Link href={qp(`members/${host.id}`)} className="shrink-0">
            <Avatar name={host.displayName} photoUrl={host.photoUrl} emoji={host.avatarEmoji} color={host.avatarColor} size={48} />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold">{m.title}</h3>
          <p className="qp-muted text-sm">
            {m.isHost ? "Your meetup" : host ? (
              <>
                with <Link href={qp(`members/${host.id}`)} className="font-semibold underline">{host.displayName}, {host.age}</Link>
                {host.isVerified ? " · Verified" : ""}
              </>
            ) : null}
          </p>
        </div>
        {m.cancelled ? <span className="qp-chip">Cancelled</span> : m.myRequest === "accepted" ? <span className="qp-chip qp-chip-teal">You're in</span> : m.myRequest === "pending" ? <span className="qp-chip">Asked</span> : null}
      </div>
      <p className="font-semibold">{timeRange(m.startsAt, m.endsAt)}</p>
      <p className="qp-muted text-sm">
        {[m.area, m.city].filter(Boolean).join(", ")} · {full ? "Full" : `${m.spotsLeft} of ${m.spots} ${m.spots === 1 ? "spot" : "spots"} open`}
      </p>
      {m.details && <p className="whitespace-pre-line">{m.details}</p>}
      {m.place ? (
        <p className="rounded-2xl p-3 text-sm" style={{ background: "var(--qp-teal-soft)", color: "var(--qp-teal)" }}>
          <span className="font-semibold">Where:</span> {m.place}
          {m.isHost ? " (only people you accept see this)" : ""}
        </p>
      ) : (
        !m.isHost && m.hasPlace && <p className="qp-muted text-sm">The exact place is shared once the host accepts you.</p>
      )}

      {error && <p className="qp-error" role="alert">{error}</p>}
      {notice && <p role="status" className="text-sm font-semibold" style={{ color: "var(--qp-teal)" }}>{notice}</p>}
      {chat && (
        <p className="text-sm">
          <Link href={qp(`chats/${chat}`)} className="font-semibold underline" style={{ color: "var(--qp-teal)" }}>Open your chat to sort out the details</Link>
        </p>
      )}

      {m.isHost ? (
        <>
          <div className="flex flex-wrap gap-2">
            <button className="qp-btn qp-btn-primary px-4 py-2 text-sm" onClick={manage} disabled={busy}>
              {open ? "Hide requests" : m.pending ? `See requests (${m.pending} new)` : "See requests"}
            </button>
            <button className="qp-btn qp-btn-ghost px-4 py-2 text-sm" onClick={cancel} disabled={busy}>Cancel meetup</button>
          </div>
          {open && (
            <ul className="space-y-2">
              {(m.requests || []).length === 0 && <li className="qp-muted text-sm">Nobody has asked to join yet.</li>}
              {(m.requests || []).map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl p-3" style={{ background: "var(--qp-bg)" }}>
                  <Link href={qp(`members/${r.user.id}`)} className="shrink-0">
                    <Avatar name={r.user.displayName} photoUrl={r.user.photoUrl} emoji={r.user.avatarEmoji} color={r.user.avatarColor} size={44} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={qp(`members/${r.user.id}`)} className="font-bold underline">{r.user.displayName}, {r.user.age}</Link>
                    {r.note && <p className="text-sm">“{r.note}”</p>}
                  </div>
                  {r.status === "pending" ? (
                    <div className="flex gap-2">
                      <button className="qp-btn qp-btn-primary px-3 py-2 text-sm" onClick={() => decide(r.id, true)} disabled={busy || full}>Accept</button>
                      <button className="qp-btn qp-btn-ghost px-3 py-2 text-sm" onClick={() => decide(r.id, false)} disabled={busy}>Decline</button>
                    </div>
                  ) : r.status === "accepted" ? (
                    <div className="flex items-center gap-2">
                      <span className="qp-chip qp-chip-teal">Coming</span>
                      <button className="qp-muted text-sm underline" onClick={() => decide(r.id, false)} disabled={busy}>Remove</button>
                    </div>
                  ) : (
                    <span className="qp-chip">Declined</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : m.cancelled ? null : m.myRequest === "pending" || m.myRequest === "accepted" ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="qp-muted text-sm">{m.myRequest === "accepted" ? "The host said yes. Check your chats for a message." : "Waiting for the host to answer."}</p>
          <button className="qp-btn qp-btn-ghost px-4 py-2 text-sm" onClick={withdraw} disabled={busy}>{m.myRequest === "accepted" ? "I can't make it" : "Withdraw"}</button>
        </div>
      ) : m.myRequest === "declined" ? (
        <p className="qp-muted text-sm">The host went with someone else this time.</p>
      ) : asking ? (
        <div className="space-y-2">
          <label className="qp-label" htmlFor={`note-${m.id}`}>Say hello (optional)</label>
          <textarea id={`note-${m.id}`} className="qp-input" maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Sounds fun, I'd love to join." />
          <div className="flex gap-2">
            <button className="qp-btn qp-btn-primary px-4 py-2 text-sm" onClick={ask} disabled={busy}>Send request</button>
            <button className="qp-btn qp-btn-ghost px-4 py-2 text-sm" onClick={() => setAsking(false)}>Back</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button className="qp-btn qp-btn-primary px-4 py-2 text-sm" onClick={() => setAsking(true)} disabled={full}>{full ? "Full" : "Ask to join"}</button>
          <button className="qp-muted text-sm underline" onClick={report}>Report</button>
        </div>
      )}
    </li>
  );
}

export default function Meetups() {
  const [tab, setTab] = useState<"board" | "mine">("board");
  const [board, setBoard] = useState<Meetup[] | null>(null);
  const [mine, setMine] = useState<{ hosting: Meetup[]; joining: Meetup[] } | null>(null);
  const [limits, setLimits] = useState<Limits | null>(null);
  const [city, setCity] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [b, m] = await Promise.all([
        api<{ meetups: Meetup[]; limits: Limits }>(`/meetups${city.trim() ? `?city=${encodeURIComponent(city.trim())}` : ""}`),
        api<{ hosting: Meetup[]; joining: Meetup[] }>("/meetups/mine"),
      ]);
      setBoard(b.meetups);
      setLimits(b.limits);
      setMine(m);
    } catch (err: any) {
      setError(err.message);
    }
  }, [city]);

  useEffect(() => {
    load();
    // Reload on demand when the city filter is submitted, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mineCount = (mine?.hosting.length || 0) + (mine?.joining.length || 0);
  const newRequests = (mine?.hosting || []).reduce((n, m) => n + (m.pending || 0), 0);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Meetups</h1>
          <p className="qp-muted">Say when you're free and see who'd like to join you.</p>
        </div>
        {!posting && <button className="qp-btn qp-btn-primary" onClick={() => setPosting(true)}>Post a meetup</button>}
      </div>

      {posting && (
        <PostForm
          limits={limits}
          onCancel={() => setPosting(false)}
          onPosted={() => {
            setPosting(false);
            setTab("mine");
            load();
          }}
        />
      )}

      <details className="qp-card p-4 text-sm">
        <summary className="cursor-pointer font-bold">Meeting safely</summary>
        <ul className="qp-muted mt-2 list-disc space-y-1 pl-5">
          <li>Meet in a public place, and get there and back on your own.</li>
          <li>Tell a friend where you're going and who you're meeting.</li>
          <li>Keep chatting here until you've met. You never need to give out your number or address.</li>
          <li>If something feels off, leave. You can report or block anyone, any time.</li>
        </ul>
      </details>

      <div className="flex gap-1" role="tablist" aria-label="Meetups">
        <button role="tab" aria-selected={tab === "board"} aria-current={tab === "board" ? "page" : undefined} className="qp-navlink" onClick={() => setTab("board")}>Coming up</button>
        <button role="tab" aria-selected={tab === "mine"} aria-current={tab === "mine" ? "page" : undefined} className="qp-navlink" onClick={() => setTab("mine")}>
          Mine{mineCount ? ` (${mineCount})` : ""}{newRequests ? ` · ${newRequests} new` : ""}
        </button>
      </div>

      {error && <p className="qp-error" role="alert">{error}</p>}

      {tab === "board" ? (
        <>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
          >
            <label htmlFor="mu-filter" className="sr-only">Filter by city</label>
            <input id="mu-filter" className="qp-input" placeholder="Filter by city" value={city} onChange={(e) => setCity(e.target.value)} />
            <button className="qp-btn qp-btn-ghost py-2">Filter</button>
          </form>
          {board === null ? (
            <p className="qp-muted py-10 text-center">Loading…</p>
          ) : board.length === 0 ? (
            <div className="qp-card space-y-3 p-8 text-center">
              <p className="text-4xl">☕</p>
              <p className="qp-muted">{city.trim() ? "No meetups there yet." : "No meetups posted yet."} Be the first to say when you're free.</p>
            </div>
          ) : (
            <ul className="space-y-4">{board.map((m) => <Card key={m.id} meetup={m} onChanged={load} />)}</ul>
          )}
        </>
      ) : mine === null ? (
        <p className="qp-muted py-10 text-center">Loading…</p>
      ) : mineCount === 0 ? (
        <p className="qp-card qp-muted p-8 text-center">You haven't posted or asked to join a meetup yet.</p>
      ) : (
        <div className="space-y-6">
          {mine.hosting.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-bold">You're hosting</h2>
              <ul className="space-y-4">{mine.hosting.map((m) => <Card key={m.id} meetup={m} onChanged={load} />)}</ul>
            </section>
          )}
          {mine.joining.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-bold">You asked to join</h2>
              <ul className="space-y-4">{mine.joining.map((m) => <Card key={m.id} meetup={m} onChanged={load} />)}</ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
