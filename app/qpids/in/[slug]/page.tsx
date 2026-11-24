"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { qp } from "../../lib/paths";
import { useAuth } from "../../lib/auth";
import SafetyNotice from "../../SafetyNotice";

// A launch page for one place, e.g. /in/missouri. Posts, flyers and QR codes
// point here. The offer numbers come from the backend, so they are never
// written into this page.
type Campaign = {
  slug: string;
  name: string;
  cities: string[];
  offer: { premiumDays: number; sparks: number; limit: number; left: number };
};

const REASONS = [
  { title: "Post a meetup, pick who joins", body: "Coffee on Saturday, trivia night, a walk in the park. You choose who comes, and the exact place stays private until you say yes." },
  { title: "Real people, checked photos", body: "A person reviews every photo members add. Adults only." },
  { title: "Help shape it", body: "We are new here. Founding members tell us what to build next, and we listen." },
];

export default function CampaignPage() {
  const slug = String(useParams<{ slug: string }>()?.slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!slug) return setMissing(true);
    api<{ campaign: Campaign }>(`/public/campaigns/${slug}`)
      .then((r) => setCampaign(r.campaign))
      .catch(() => setMissing(true));
  }, [slug]);

  if (missing) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
        <h1 className="text-3xl font-bold">We are not there yet</h1>
        <p className="qp-muted">Qpids Place is opening one place at a time. You are welcome to join now and be first when we reach you.</p>
        <Link href={qp("join")} className="qp-btn qp-btn-primary">Join free</Link>
      </div>
    );
  }
  if (!campaign) return <p className="qp-muted py-20 text-center">Loading…</p>;

  const { offer } = campaign;
  const perks = [
    offer.premiumDays > 0 ? `${offer.premiumDays} days of Premium free` : "",
    offer.sparks > 0 ? `✨ ${offer.sparks} sparks` : "",
  ].filter(Boolean);
  const founding = offer.left > 0 && perks.length > 0;

  return (
    <div className="space-y-12">
      <section className="space-y-6 pt-6 text-center">
        <span className="qp-chip qp-chip-teal">New in {campaign.name} · 18+</span>
        <h1 className="mx-auto max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
          Qpids Place is opening in <span style={{ color: "var(--qp-coral)" }}>{campaign.name}</span>.
        </h1>
        <p className="qp-muted mx-auto max-w-xl text-lg">
          A new dating site for meeting people near you in real life. We are just getting started here, and you can be one of the first in.
        </p>
        {founding && (
          <div className="qp-card mx-auto max-w-md space-y-1 p-5" style={{ background: "var(--qp-teal-soft)" }}>
            <p className="qp-serif text-xl font-bold">Founding members get {perks.join(" and ")}</p>
            <p className="text-sm">
              For the first {offer.limit.toLocaleString()} people in {campaign.name}. {offer.left.toLocaleString()} {offer.left === 1 ? "spot" : "spots"} left.
            </p>
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          {user ? (
            <Link href={qp("meetups")} className="qp-btn qp-btn-primary">See the meetup board</Link>
          ) : (
            <>
              <Link href={`${qp("join")}?campaign=${campaign.slug}`} className="qp-btn qp-btn-primary">
                {founding ? "Become a founding member" : "Join free"}
              </Link>
              <Link href={qp("login")} className="qp-btn qp-btn-ghost">I have an account</Link>
            </>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {REASONS.map((r) => (
          <div key={r.title} className="qp-card space-y-2 p-5">
            <h2 className="qp-serif text-xl font-bold">{r.title}</h2>
            <p className="qp-muted">{r.body}</p>
          </div>
        ))}
      </section>

      {campaign.cities.length > 0 && (
        <section className="space-y-3 text-center">
          <h2 className="text-2xl font-bold">Where we are starting</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {campaign.cities.map((c) => (
              <span key={c} className="qp-chip">{c}</span>
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-2xl">
        <SafetyNotice />
      </div>
    </div>
  );
}
