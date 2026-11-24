"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "./lib/api";
import { qp } from "./lib/paths";
import { useAuth } from "./lib/auth";

type Stats = { members: number; matches: number; gifts: number; rooms: number };

const STEPS = [
  { title: "Make a profile that sounds like you", body: "A photo, a few prompts, the things you love. No essays required." },
  { title: "Meet people who fit", body: "Discover ranks people by shared interests, distance and who is active, not by who paid most." },
  { title: "Match, then talk", body: "When you both like each other, a chat opens. Gifts, video dates and icebreakers from Cupid, our AI coach, are there when you want them." },
];

export default function QpidsHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api<Stats>("/public/stats").then(setStats).catch(() => {});
  }, []);

  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 pt-6 md:grid-cols-2">
        <div className="space-y-6">
          <span className="qp-chip qp-chip-teal">Real people · verified photos · 18+</span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Meet someone <span style={{ color: "var(--qp-coral)" }}>worth meeting</span>.
          </h1>
          <p className="qp-muted max-w-md text-lg">
            Qpids Place is where thoughtful people find each other. Tell us what you love, and we will introduce you to people who love it too.
          </p>
          <div className="flex flex-wrap gap-3">
            {user ? (
              <Link href={qp("discover")} className="qp-btn qp-btn-primary">
                Start discovering
              </Link>
            ) : (
              <>
                <Link href={qp("join")} className="qp-btn qp-btn-primary">
                  Join free
                </Link>
                <Link href={qp("login")} className="qp-btn qp-btn-ghost">
                  I have an account
                </Link>
              </>
            )}
          </div>
          {stats && (
            <dl className="flex gap-8 pt-2">
              <div>
                <dt className="qp-muted text-sm">Members</dt>
                <dd className="qp-serif text-2xl font-bold">{stats.members.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="qp-muted text-sm">Matches made</dt>
                <dd className="qp-serif text-2xl font-bold">{stats.matches.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="qp-muted text-sm">Gifts sent</dt>
                <dd className="qp-serif text-2xl font-bold">{stats.gifts.toLocaleString()}</dd>
              </div>
            </dl>
          )}
        </div>
        <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
          <div className="qp-card absolute -left-4 top-8 h-72 w-56 -rotate-6" style={{ background: "var(--qp-teal-soft)" }} />
          <div className="qp-card relative ml-10 overflow-hidden">
            <div className="relative flex h-64 items-center justify-center text-7xl" style={{ background: "var(--qp-blush)" }}>
              <span className="qp-chip absolute left-3 top-3 text-xs font-semibold" style={{ background: "#fff" }}>Sample profile</span>
              ☕
            </div>
            <div className="space-y-2 p-5">
              <p className="qp-serif text-xl font-bold">Maya, 29</p>
              <p className="qp-muted text-sm">“The way to my heart is a bookshop with a coffee bar.”</p>
              <div className="flex flex-wrap gap-2">
                <span className="qp-chip">Books</span>
                <span className="qp-chip">Hiking</span>
                <span className="qp-chip qp-chip-teal">92% match</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.title} className="qp-card p-6">
            <p className="qp-serif mb-2 text-3xl font-bold" style={{ color: "var(--qp-coral)" }}>
              {i + 1}
            </p>
            <h2 className="mb-2 text-lg font-bold">{s.title}</h2>
            <p className="qp-muted">{s.body}</p>
          </div>
        ))}
      </section>

      <section className="qp-card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between" style={{ background: "var(--qp-blush)" }}>
        <div>
          <h2 className="text-2xl font-bold">Safety comes standard</h2>
          <p className="qp-muted max-w-xl">Photo verification, one-tap block and report, and a team that reviews every report. Everyone here is 18 or older.</p>
        </div>
        {!user && (
          <Link href={qp("join")} className="qp-btn qp-btn-primary shrink-0">
            Create your profile
          </Link>
        )}
      </section>
    </div>
  );
}
