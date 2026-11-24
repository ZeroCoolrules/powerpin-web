"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api, mediaUrl } from "../lib/api";
import type { FieldDef } from "../lib/extras";
import { qp } from "../lib/paths";

type QueuePhoto = {
  id: number;
  kind: "album" | "avatar";
  url: string | null;
  caption: string;
  status: "pending" | "approved" | "rejected";
  rejectReason: string | null;
  createdAt: string;
  user: { id: number; username: string; displayName: string; age: number };
};

const REASONS = ["Not a photo of the member", "Nudity or sexual content", "Shows someone under 18", "Contact details or advertising", "Too blurry or low quality"];

// New photos wait here until an admin approves or removes them.
function PhotoQueue() {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [photos, setPhotos] = useState<QueuePhoto[] | null>(null);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState("");
  const [rejecting, setRejecting] = useState<number | null>(null);
  const [reason, setReason] = useState(REASONS[0]);

  const load = useCallback(() => {
    setPhotos(null);
    api<{ photos: QueuePhoto[]; pending: number }>(`/admin/photos?status=${status}`)
      .then((r) => {
        setPhotos(r.photos);
        setPending(r.pending);
      })
      .catch((e) => setError(e.message));
  }, [status]);
  useEffect(load, [load]);

  async function decide(id: number, approve: boolean) {
    setError("");
    try {
      const r = await api<{ pending: number }>(`/admin/photos/${id}/decision`, { method: "POST", body: approve ? { approve: true } : { approve: false, reason } });
      setPhotos((list) => (list || []).filter((p) => p.id !== id));
      setPending(r.pending);
      setRejecting(null);
    } catch (err: any) {
      setError(err.message);
      load();
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Photo review {pending > 0 && <span className="qp-chip ml-1 align-middle">{pending} waiting</span>}</h2>
        <div className="flex gap-1" role="tablist" aria-label="Photo status">
          {(["pending", "approved", "rejected"] as const).map((s) => (
            <button key={s} role="tab" aria-selected={status === s} className="qp-navlink" aria-current={status === s ? "page" : undefined} onClick={() => setStatus(s)}>
              {s === "pending" ? "Waiting" : s === "approved" ? "Approved" : "Removed"}
            </button>
          ))}
        </div>
      </div>
      <p className="qp-muted text-sm">
        Album photos stay hidden until you approve them. Profile pictures show right away, so removing one here takes it off the profile.
      </p>
      {error && <p className="qp-error" role="alert">{error}</p>}
      {photos === null ? (
        <p className="qp-muted">Loading…</p>
      ) : photos.length === 0 ? (
        <p className="qp-card qp-muted p-6 text-center">{status === "pending" ? "Nothing waiting. You're all caught up." : "Nothing here yet."}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {photos.map((p) => (
            <li key={p.id} className="qp-card overflow-hidden">
              <div className="flex aspect-square items-center justify-center" style={{ background: "var(--qp-bg)" }}>
                {p.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaUrl(p.url) || ""} alt={`Photo from ${p.user.displayName}`} className="h-full w-full object-contain" />
                ) : (
                  <span className="qp-muted px-4 text-center text-sm">Removed: {p.rejectReason}</span>
                )}
              </div>
              <div className="space-y-2 p-3 text-sm">
                <p>
                  <Link href={qp(`members/${p.user.id}`)} className="font-bold underline">{p.user.displayName}, {p.user.age}</Link>{" "}
                  <span className="qp-muted">@{p.user.username}</span>
                </p>
                <p>
                  <span className="qp-chip">{p.kind === "avatar" ? "Profile picture" : "Album"}</span>
                </p>
                {p.caption && <p>“{p.caption}”</p>}
                {p.status === "pending" &&
                  (rejecting === p.id ? (
                    <div className="space-y-2">
                      <label className="qp-label" htmlFor={`why-${p.id}`}>Reason shown to the member</label>
                      <select id={`why-${p.id}`} className="qp-input" value={reason} onChange={(e) => setReason(e.target.value)}>
                        {REASONS.map((r) => <option key={r}>{r}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <button className="qp-btn qp-btn-primary flex-1 px-3 py-2 text-sm" onClick={() => decide(p.id, false)}>Remove photo</button>
                        <button className="qp-btn qp-btn-ghost px-3 py-2 text-sm" onClick={() => setRejecting(null)}>Back</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button className="qp-btn qp-btn-primary flex-1 px-3 py-2 text-sm" onClick={() => decide(p.id, true)}>Approve</button>
                      <button className="qp-btn qp-btn-ghost flex-1 px-3 py-2 text-sm" onClick={() => setRejecting(p.id)}>Remove</button>
                    </div>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// The questions members can answer on their profile.
function Fields() {
  const [fields, setFields] = useState<FieldDef[] | null>(null);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [type, setType] = useState<FieldDef["type"]>("select");
  const [choices, setChoices] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ fields: FieldDef[] }>("/admin/profile-fields").then((r) => setFields(r.fields)).catch((e) => setError(e.message));
  }, []);

  const replace = (f: FieldDef) => setFields((list) => (list || []).map((x) => (x.key === f.key ? f : x)).sort((a, b) => a.sort - b.sort));

  async function update(key: string, body: Record<string, unknown>) {
    setError("");
    try {
      replace((await api<{ field: FieldDef }>(`/admin/profile-fields/${key}`, { method: "PUT", body })).field);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Swap places with the neighbour above or below.
  async function move(i: number, by: -1 | 1) {
    const a = fields?.[i];
    const b = fields?.[i + by];
    if (!a || !b) return;
    await update(a.key, { sort: b.sort });
    await update(b.key, { sort: a.sort });
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const options = type === "select" ? choices.split(/[\n,]/).map((c) => c.trim()).filter(Boolean) : undefined;
      const { field } = await api<{ field: FieldDef }>("/admin/profile-fields", { method: "POST", body: { label, type, options } });
      setFields((list) => [...(list || []), field]);
      setLabel("");
      setChoices("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function editChoices(f: FieldDef) {
    if (!Array.isArray(f.options)) return;
    const next = window.prompt(`Choices for "${f.label}", separated by commas`, f.options.join(", "));
    if (next === null) return;
    update(f.key, { options: next.split(",").map((c) => c.trim()).filter(Boolean) });
  }

  function rename(f: FieldDef) {
    const next = window.prompt("Name of this question", f.label);
    if (next) update(f.key, { label: next });
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Profile questions</h2>
      <p className="qp-muted text-sm">Members see these under "More about you". Hiding a question keeps the answers but stops showing them.</p>
      {error && <p className="qp-error" role="alert">{error}</p>}
      {fields === null ? (
        <p className="qp-muted">Loading…</p>
      ) : (
        <ul className="qp-card divide-y" style={{ borderColor: "var(--qp-line)" }}>
          {fields.map((f, i) => (
            <li key={f.key} className="flex flex-wrap items-center gap-3 p-3" style={{ borderColor: "var(--qp-line)", opacity: f.active ? 1 : 0.55 }}>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{f.label} {!f.active && <span className="qp-chip ml-1">Hidden</span>}</p>
                <p className="qp-muted truncate text-sm">
                  {f.type === "select" && Array.isArray(f.options) ? f.options.join(" · ") : f.type === "number" ? "A number" : "Short text"}
                </p>
              </div>
              <div className="flex flex-wrap gap-1 text-sm">
                <button className="qp-action" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${f.label} up`}>↑</button>
                <button className="qp-action" onClick={() => move(i, 1)} disabled={i === fields.length - 1} aria-label={`Move ${f.label} down`}>↓</button>
                <button className="qp-action" onClick={() => rename(f)}>Rename</button>
                {f.type === "select" && <button className="qp-action" onClick={() => editChoices(f)}>Choices</button>}
                <button className="qp-action" onClick={() => update(f.key, { active: !f.active })}>{f.active ? "Hide" : "Show"}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={add} className="qp-card grid gap-3 p-4 sm:grid-cols-2">
        <h3 className="text-lg font-bold sm:col-span-2">Add a question</h3>
        <div>
          <label className="qp-label" htmlFor="nf-label">Name</label>
          <input id="nf-label" className="qp-input" required maxLength={60} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Favourite cuisine" />
        </div>
        <div>
          <label className="qp-label" htmlFor="nf-type">Answer type</label>
          <select id="nf-type" className="qp-input" value={type} onChange={(e) => setType(e.target.value as FieldDef["type"])}>
            <option value="select">Pick from a list</option>
            <option value="text">Short text</option>
            <option value="number">A number</option>
          </select>
        </div>
        {type === "select" && (
          <div className="sm:col-span-2">
            <label className="qp-label" htmlFor="nf-choices">Choices, separated by commas</label>
            <input id="nf-choices" className="qp-input" required value={choices} onChange={(e) => setChoices(e.target.value)} placeholder="Italian, Thai, Mexican" />
          </div>
        )}
        <div className="sm:col-span-2">
          <button className="qp-btn qp-btn-primary px-4 py-2 text-sm" disabled={busy}>{busy ? "Adding…" : "Add question"}</button>
        </div>
      </form>
    </section>
  );
}

export default function Admin() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    api<{ isAdmin?: boolean }>("/me/verification").then((r) => setAllowed(!!r.isAdmin)).catch(() => setAllowed(false));
  }, []);

  if (allowed === null) return <p className="qp-muted py-16 text-center">Loading…</p>;
  if (!allowed) {
    return (
      <div className="qp-card mx-auto max-w-md p-8 text-center">
        <p className="qp-muted mb-4">This page is for site admins.</p>
        <Link href={qp("discover")} className="qp-btn qp-btn-primary">Back to Discover</Link>
      </div>
    );
  }
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Admin</h1>
      <PhotoQueue />
      <Fields />
    </div>
  );
}
