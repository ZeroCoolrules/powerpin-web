"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { api, mediaUrl } from "../lib/api";
import type { AlbumPhoto, FieldDef, Referral } from "../lib/extras";
import { qp } from "../lib/paths";

// The extra questions an admin has set up ("Height", "Wants children"...).
function MoreAboutYou() {
  const [fields, setFields] = useState<FieldDef[] | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ fields: FieldDef[]; values: Record<string, string> }>("/profile-fields")
      .then((r) => {
        setFields(r.fields);
        setValues(r.values);
      })
      .catch(() => setFields([]));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const all = Object.fromEntries((fields || []).map((f) => [f.key, values[f.key] || ""]));
      const r = await api<{ values: Record<string, string> }>("/me/profile-fields", { method: "PUT", body: { values: all } });
      setValues(r.values);
      setNotice("Saved.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!fields || fields.length === 0) return null;
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNotice("");
    setValues((v) => ({ ...v, [key]: e.target.value }));
  };

  return (
    <form onSubmit={save} className="qp-card space-y-4 p-5">
      <div>
        <h2 className="text-xl font-bold">More about you</h2>
        <p className="qp-muted text-sm">All optional. Answer what you like and leave the rest blank.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const id = `pf-${f.key}`;
          return (
            <div key={f.key}>
              <label className="qp-label" htmlFor={id}>{f.label}</label>
              {f.type === "select" && Array.isArray(f.options) ? (
                <select id={id} className="qp-input" value={values[f.key] || ""} onChange={set(f.key)}>
                  <option value="">Prefer not to say</option>
                  {f.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === "number" ? (
                <input
                  id={id}
                  className="qp-input"
                  type="number"
                  min={!Array.isArray(f.options) ? f.options?.min : undefined}
                  max={!Array.isArray(f.options) ? f.options?.max : undefined}
                  value={values[f.key] || ""}
                  onChange={set(f.key)}
                />
              ) : (
                <input id={id} className="qp-input" maxLength={80} value={values[f.key] || ""} onChange={set(f.key)} />
              )}
            </div>
          );
        })}
      </div>
      {error && <p className="qp-error" role="alert">{error}</p>}
      <div className="flex items-center gap-3">
        <button className="qp-btn qp-btn-ghost px-4 py-2 text-sm" disabled={saving}>{saving ? "Saving…" : "Save answers"}</button>
        {notice && <span role="status" className="text-sm font-semibold" style={{ color: "var(--qp-teal)" }}>{notice}</span>}
      </div>
    </form>
  );
}

const STATUS_LABEL: Record<string, string> = { pending: "In review", approved: "Showing", rejected: "Not approved" };

// Extra photos. Each one is checked by our team before others can see it.
function Album() {
  const [photos, setPhotos] = useState<AlbumPhoto[] | null>(null);
  const [max, setMax] = useState(12);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api<{ photos: AlbumPhoto[]; max: number }>("/me/photos")
      .then((r) => {
        setPhotos(r.photos);
        setMax(r.max);
      })
      .catch(() => setPhotos([]));
  }, []);

  async function add(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("photo", file);
      fd.append("caption", caption);
      const { photo } = await api<{ photo: AlbumPhoto }>("/me/photos", { method: "POST", form: fd });
      setPhotos((list) => [...(list || []), photo]);
      setCaption("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(id: number) {
    setError("");
    try {
      await api(`/me/photos/${id}`, { method: "DELETE" });
      setPhotos((list) => (list || []).filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (!photos) return null;
  const live = photos.filter((p) => p.status !== "rejected").length;

  return (
    <section className="qp-card space-y-4 p-5">
      <div>
        <h2 className="text-xl font-bold">Photo album</h2>
        <p className="qp-muted text-sm">
          Up to {max} more photos. Each one is checked by our team before other people can see it, usually within a day.
        </p>
      </div>
      {photos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--qp-line)" }}>
              <div className="flex aspect-square items-center justify-center" style={{ background: "var(--qp-bg)" }}>
                {p.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaUrl(p.url) || ""} alt={p.caption || "Album photo"} className="h-full w-full object-cover" />
                ) : (
                  <span className="qp-muted px-3 text-center text-sm">{p.rejectReason || "This photo wasn't approved."}</span>
                )}
              </div>
              <div className="space-y-1 p-2 text-sm">
                <span className={`qp-chip ${p.status === "approved" ? "qp-chip-teal" : ""}`}>{STATUS_LABEL[p.status || "pending"]}</span>
                {p.caption && <p className="truncate">{p.caption}</p>}
                <button type="button" className="qp-muted underline" onClick={() => remove(p.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {live < max ? (
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-[180px] flex-1">
            <label className="qp-label" htmlFor="album-caption">Caption (optional)</label>
            <input id="album-caption" className="qp-input" maxLength={140} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Where was this?" />
          </div>
          <label className="qp-btn qp-btn-ghost cursor-pointer px-4 py-2 text-sm">
            {busy ? "Uploading…" : "Add a photo"}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={add} disabled={busy} />
          </label>
        </div>
      ) : (
        <p className="qp-muted text-sm">Your album is full. Remove a photo to add another.</p>
      )}
      {error && <p className="qp-error" role="alert">{error}</p>}
    </section>
  );
}

// A personal invite link and what it has earned so far.
function Invite() {
  const [ref, setRef] = useState<Referral | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api<Referral>("/me/referral").then(setRef).catch(() => {});
  }, []);

  if (!ref) return null;
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}${qp("join")}?ref=${ref.code}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* the link is selectable in the box */
    }
  }

  return (
    <section className="qp-card space-y-3 p-5" style={{ background: "var(--qp-blush)" }}>
      <div>
        <h2 className="text-xl font-bold">Invite a friend</h2>
        <p className="text-sm">
          They get ✨ {ref.welcome} when they join with your link. You get ✨ {ref.reward} once their first photo is approved.
        </p>
      </div>
      <div className="flex gap-2">
        <label htmlFor="invite-link" className="sr-only">Your invite link</label>
        <input id="invite-link" className="qp-input" readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
        <button type="button" className="qp-btn qp-btn-primary py-2" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      </div>
      <p className="qp-muted text-sm">
        {ref.joined === 0
          ? "Nobody has joined with your link yet."
          : `${ref.joined} joined with your link. ${ref.rewarded} rewarded so far, ✨ ${ref.sparksEarned} earned.`}
      </p>
    </section>
  );
}

function AdminLink() {
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    api<{ isAdmin?: boolean }>("/me/verification").then((r) => setAdmin(!!r.isAdmin)).catch(() => {});
  }, []);
  if (!admin) return null;
  return (
    <section className="qp-card flex items-center justify-between gap-4 p-5">
      <div>
        <h2 className="text-xl font-bold">Site admin</h2>
        <p className="qp-muted text-sm">Review new photos and manage the profile questions.</p>
      </div>
      <Link href={qp("admin")} className="qp-btn qp-btn-ghost px-4 py-2 text-sm">Open admin</Link>
    </section>
  );
}

export default function ProfileExtras({ userId }: { userId: number }) {
  return (
    <>
      <MoreAboutYou />
      <Album />
      <Invite />
      <AdminLink />
      <p className="text-sm">
        <Link href={qp(`members/${userId}`)} className="font-semibold underline" style={{ color: "var(--qp-teal)" }}>
          See your profile as others see it
        </Link>
      </p>
    </>
  );
}
