"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { qp } from "../lib/paths";

// A paid phone session with Cupid, the voice coach. The number and the
// one-time code only come back from the backend after the member has paid,
// so neither is ever in this code or on the page before then.

type Session = {
  id: number;
  phone: string;
  phoneHref: string;
  code: string;
  minutes: number;
  status: "ready" | "in_progress";
  callBy: string;
  endsAt: string | null;
};
type Past = { id: number; sparksSpent: number; minutes: number; paidAt: string; startedAt: string | null; used: boolean };
type Coach = { available: boolean; cost: number; minutes: number; codeHours: number; sparks: number; session: Session | null; history: Past[] };

const when = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" }) : "";

export default function CoachPage() {
  const { refresh } = useAuth();
  const [data, setData] = useState<Coach | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    () => api<Coach>("/coach").then(setData).catch((e) => setError(e.message)),
    []
  );
  useEffect(() => {
    load();
  }, [load]);

  async function pay() {
    setPaying(true);
    setError("");
    try {
      await api("/coach/sessions", { method: "POST" });
      await Promise.all([load(), refresh()]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  }

  const s = data?.session;
  const short = data ? Math.max(0, data.cost - data.sparks) : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Talk to Cupid</h1>
        <p className="qp-muted">A private phone session with your dating coach.</p>
      </div>

      {error && <p className="qp-error" role="alert">{error}</p>}

      {!data ? (
        !error && <p className="qp-muted">Loading…</p>
      ) : !data.available ? (
        <div className="qp-card p-6 text-center">
          <p className="qp-serif text-xl font-bold">Coming soon</p>
          <p className="qp-muted">Phone sessions with Cupid aren't open yet. Until then, Cupid is in your chats.</p>
          <Link href={qp("chats")} className="qp-btn qp-btn-ghost mt-4">Go to chats</Link>
        </div>
      ) : s ? (
        <section className="qp-card space-y-4 p-6 text-center" style={{ background: "var(--qp-blush)" }} aria-live="polite">
          <p className="qp-serif text-2xl font-bold">
            {s.status === "in_progress" ? "Your session is in progress" : "You're all set. Call Cupid now."}
          </p>
          <a href={s.phoneHref} className="qp-btn qp-btn-primary">Call {s.phone}</a>
          <div>
            <p className="qp-muted text-sm">When Cupid asks, say or key in your code</p>
            <p className="text-4xl font-bold" style={{ letterSpacing: "0.25em" }} aria-label={`Your code is ${s.code.split("").join(" ")}`}>
              {s.code}
            </p>
          </div>
          <p className="qp-muted text-sm">
            {s.status === "in_progress"
              ? `Your ${s.minutes} minutes run until ${when(s.endsAt)}. If the call drops, call back with the same code.`
              : `Good for one ${s.minutes}-minute session. Call by ${when(s.callBy)}. The clock starts when Cupid accepts your code.`}
          </p>
          <p className="qp-muted text-sm">This code is yours alone. Please don't share it.</p>
        </section>
      ) : (
        <>
          <section className="qp-card space-y-3 p-6">
            <h2 className="text-xl font-bold">Say it out loud, get an answer back</h2>
            <p className="qp-muted">
              Call Cupid and talk it through: what to say next, how to read a match, how to plan a first date, or how
              to get your confidence back.
            </p>
            <ul className="qp-muted list-disc space-y-1 pl-5">
              <li>One private {data.minutes}-minute phone session</li>
              <li>Call any time in the next {data.codeHours} hours</li>
              <li>You get the number and a personal code as soon as you pay</li>
            </ul>
          </section>

          <section className="qp-card flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="font-bold">One session: {data.cost.toLocaleString()} sparks</p>
              <p className="qp-muted text-sm">You have {data.sparks.toLocaleString()} sparks.</p>
            </div>
            {short > 0 ? (
              <Link href={qp("sparks")} className="qp-btn qp-btn-primary">Get {short.toLocaleString()} more sparks</Link>
            ) : (
              <button className="qp-btn qp-btn-primary" disabled={paying} onClick={pay}>
                {paying ? "Setting up…" : "Start a session"}
              </button>
            )}
          </section>
        </>
      )}

      {!!data?.history?.length && (
        <section className="space-y-2">
          <h2 className="text-lg font-bold">Past sessions</h2>
          {data.history.map((h) => (
            <div key={h.id} className="qp-card flex items-center justify-between p-4">
              <div>
                <p>{when(h.startedAt || h.paidAt)}</p>
                <p className="qp-muted text-sm">{h.used ? `${h.minutes} minutes` : "Not used"}</p>
              </div>
              <p className="qp-muted text-sm">{h.sparksSpent.toLocaleString()} sparks</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
