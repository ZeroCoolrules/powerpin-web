"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, mediaUrl, type Member } from "../../lib/api";
import type { Compatibility, ProfileExtras } from "../../lib/extras";
import { qp } from "../../lib/paths";
import SafetyNotice from "../../SafetyNotice";

type Profile = { user: Member; isSelf: boolean; amIBlocking: boolean };

// One member's full profile: the basics, their answers, their approved
// album photos, and a Wink button.
export default function MemberProfile() {
  const id = Number(useParams<{ id: string }>().id);
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [extras, setExtras] = useState<ProfileExtras | null>(null);
  const [fit, setFit] = useState<Compatibility | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    setError("");
    api<Profile>(`/users/${id}`).then(setProfile).catch((e) => setError(e.status === 404 ? "This profile isn't available." : e.message));
    api<ProfileExtras>(`/users/${id}/extras`).then(setExtras).catch(() => {});
    setFit(null);
    api<Compatibility>(`/users/${id}/compatibility`).then(setFit).catch(() => {});
  }, [id]);

  async function wink() {
    setBusy(true);
    setError("");
    try {
      const r = await api<{ left: number }>(`/users/${id}/wink`, { method: "POST" });
      setExtras((x) => (x ? { ...x, wink: { ...x.wink, winkedToday: true } } : x));
      setNotice(`Wink sent. You have ${r.left} left today.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function report() {
    const reason = window.prompt("What's wrong with this profile? Our team will take a look.");
    if (reason === null) return;
    try {
      await api(`/users/${id}/report`, { method: "POST", body: { reason } });
      setNotice("Thanks. We've sent this to our team.");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function block() {
    if (!profile) return;
    if (!profile.amIBlocking && !window.confirm(`Block ${profile.user.displayName}? You won't see each other any more.`)) return;
    try {
      await api(`/users/${id}/block`, { method: profile.amIBlocking ? "DELETE" : "POST" });
      if (profile.amIBlocking) setProfile({ ...profile, amIBlocking: false });
      else router.push(qp("discover"));
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (!profile) {
    return error ? <p className="qp-error mx-auto max-w-2xl" role="alert">{error}</p> : <p className="qp-muted py-16 text-center">Loading…</p>;
  }

  const u = profile.user;
  const photo = mediaUrl(u.photoUrl);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <article className="qp-card overflow-hidden sm:flex">
        <div className="flex aspect-square items-center justify-center sm:w-64 sm:shrink-0" style={{ background: u.avatarColor || "var(--qp-blush)" }}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={u.displayName} className="h-full w-full object-cover" />
          ) : (
            <span className="text-8xl" aria-hidden="true">{u.avatarEmoji}</span>
          )}
        </div>
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold">{u.displayName}, {u.age}</h1>
            {u.isVerified && <span className="qp-chip qp-chip-teal">Verified</span>}
          </div>
          {u.city && <p className="qp-muted">{u.city}</p>}
          {u.bio && <p>{u.bio}</p>}
          {profile.isSelf ? (
            <Link href={qp("profile")} className="qp-btn qp-btn-ghost px-4 py-2 text-sm">Edit your profile</Link>
          ) : (
            extras?.wink.canWink && (
              <button className="qp-btn qp-btn-primary px-5 py-2" onClick={wink} disabled={busy || extras.wink.winkedToday}>
                {extras.wink.winkedToday ? "Winked today" : "😉 Send a wink"}
              </button>
            )
          )}
          {notice && <p role="status" className="text-sm font-semibold" style={{ color: "var(--qp-teal)" }}>{notice}</p>}
          {error && <p className="qp-error" role="alert">{error}</p>}
        </div>
      </article>

      {fit && !profile.isSelf && (
        <section className="qp-card space-y-4 p-5">
          {fit.ready ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">How you fit</h2>
                  <p className="qp-muted text-sm">From the {fit.shared} questions you've both answered.</p>
                </div>
                <p className="qp-serif text-4xl font-bold" style={{ color: "var(--qp-teal)" }}>{fit.percent}%</p>
              </div>
              <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {fit.areas?.map((a) => (
                  <li key={a.key}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{a.title}</span>
                      <span className="font-semibold">{a.percent}%</span>
                    </div>
                    <div className="qp-bar" role="img" aria-label={`${a.title}: ${a.percent}%`}><span style={{ width: `${a.percent}%` }} /></div>
                  </li>
                ))}
              </ul>
              {fit.strengths && fit.strengths.length > 0 && (
                <div>
                  <h3 className="mb-1 font-bold">You line up on</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {fit.strengths.map((q) => <li key={q.key}>{q.text.replace(/[:…]$/, "")}</li>)}
                  </ul>
                </div>
              )}
              {fit.talkAbout && fit.talkAbout.length > 0 && (
                <div>
                  <h3 className="mb-1 font-bold">Worth talking about early</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {fit.talkAbout.map((q) => (
                      <li key={q.key}>
                        {q.text.replace(/[:…]$/, "")}
                        {q.mustHave && <span className="qp-chip ml-2">A must for one of you</span>}
                      </li>
                    ))}
                  </ul>
                  <p className="qp-muted mt-2 text-sm">You answered these differently. That isn't a no, just a good first conversation.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">How you fit</h2>
                <p className="qp-muted text-sm">
                  {fit.mineAnswered < (fit.needed || 8)
                    ? "Answer the questionnaire to see how the two of you line up."
                    : fit.theirsAnswered === 0
                      ? `${u.displayName} hasn't answered the questionnaire yet.`
                      : "You haven't answered enough of the same questions yet."}
                </p>
              </div>
              {fit.mineAnswered < fit.total && <Link href={qp("quiz")} className="qp-btn qp-btn-ghost px-4 py-2 text-sm">Answer questions</Link>}
            </div>
          )}
        </section>
      )}

      {u.prompts?.length > 0 && (
        <section className="space-y-3">
          {u.prompts.map((p) => (
            <div key={p.question} className="qp-card p-4">
              <p className="qp-muted text-sm">{p.question}</p>
              <p className="qp-serif text-lg">{p.answer}</p>
            </div>
          ))}
        </section>
      )}

      {extras && extras.fields.length > 0 && (
        <section className="qp-card p-5">
          <h2 className="mb-3 text-xl font-bold">About {u.displayName}</h2>
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {extras.fields.map((f) => (
              <div key={f.key}>
                <dt className="qp-muted text-sm">{f.label}</dt>
                <dd className="font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {u.interests?.length > 0 && (
        <section className="qp-card p-5">
          <h2 className="mb-3 text-xl font-bold">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {u.interests.map((i) => <span key={i} className="qp-chip">{i}</span>)}
          </div>
        </section>
      )}

      {extras && extras.photos.length > 0 && (
        <section className="qp-card p-5">
          <h2 className="mb-3 text-xl font-bold">Photos</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {extras.photos.map((p) => (
              <li key={p.id}>
                <button type="button" className="block w-full overflow-hidden rounded-2xl" onClick={() => setOpen(p.url)} aria-label={p.caption ? `Open photo: ${p.caption}` : "Open photo"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(p.url) || ""} alt={p.caption || `Photo of ${u.displayName}`} className="aspect-square w-full object-cover" />
                </button>
                {p.caption && <p className="qp-muted mt-1 truncate text-sm">{p.caption}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!profile.isSelf && (
        <p className="qp-muted flex gap-4 text-sm">
          <button className="underline" onClick={report}>Report</button>
          <button className="underline" onClick={block}>{profile.amIBlocking ? "Unblock" : "Block"}</button>
        </p>
      )}

      <SafetyNotice />

      {open && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4" style={{ background: "rgba(43,29,42,0.8)" }} role="dialog" aria-modal="true" aria-label="Photo" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(open) || ""} alt="" className="max-h-full max-w-full rounded-2xl" />
          <button className="qp-btn qp-btn-ghost absolute right-4 top-4 py-2" style={{ background: "var(--qp-surface)" }} onClick={() => setOpen(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
