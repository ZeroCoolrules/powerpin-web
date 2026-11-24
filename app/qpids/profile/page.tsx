"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { api, type Member } from "../lib/api";
import { useAuth } from "../lib/auth";
import { qp } from "../lib/paths";
import Avatar from "../Avatar";
import ProfileExtras from "./Extras";

const GENDERS = ["Woman", "Man", "Nonbinary"];
const LOOKING_FOR = [
  { value: "Interested in men", label: "Men" },
  { value: "Interested in women", label: "Women" },
  { value: "Interested in everyone", label: "Everyone" },
];
const SUGGESTED_INTERESTS = ["Hiking", "Coffee", "Cooking", "Live music", "Travel", "Books", "Dogs", "Cats", "Gaming", "Yoga", "Art", "Film", "Dancing", "Running", "Brunch"];

type Prompt = { question: string; answer: string };

function ProfileForm() {
  const { user, setUser } = useAuth();
  const welcome = useSearchParams().get("welcome") === "1";
  const [form, setForm] = useState({ displayName: "", age: "", gender: "", orientation: "", city: "", bio: "" });
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [bank, setBank] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      displayName: user.displayName || "",
      age: String(user.age || ""),
      gender: user.gender || "",
      orientation: user.orientation || "",
      city: user.city || "",
      bio: user.bio || "",
    });
    setInterests(user.interests || []);
    setPrompts(user.prompts?.length ? user.prompts : [{ question: "", answer: "" }]);
    // Only seed from the signed-in user once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    api<{ bank: string[] }>("/prompts/bank").then((r) => setBank(r.bank)).catch(() => {});
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function addInterest(value: string) {
    const v = value.trim();
    if (!v || interests.some((i) => i.toLowerCase() === v.toLowerCase()) || interests.length >= 12) return;
    setInterests((list) => [...list, v]);
    setNewInterest("");
  }

  function setPrompt(i: number, patch: Partial<Prompt>) {
    setPrompts((list) => list.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const { user: updated } = await api<{ user: Member }>("/me", {
        method: "PUT",
        body: { ...form, age: Number(form.age), interests, prompts: prompts.filter((p) => p.question && p.answer.trim()) },
      });
      setUser(updated);
      setNotice("Saved. This is how people will see you.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("photo", file);
      const { user: updated } = await api<{ user: Member }>("/me/photo", { method: "POST", form: fd });
      setUser(updated);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  if (!user) return <p className="qp-muted">Loading…</p>;

  const usedQuestions = new Set(prompts.map((p) => p.question));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {welcome && (
        <div className="qp-card p-5" style={{ background: "var(--qp-blush)" }}>
          <p className="qp-serif text-xl font-bold">Welcome to Qpids Place, {user.displayName}.</p>
          <p className="qp-muted">Add a photo and answer a prompt or two. Profiles with both get far more likes.</p>
        </div>
      )}
      <h1 className="text-3xl font-bold">Your profile</h1>

      <section className="qp-card flex items-center gap-5 p-5">
        <Avatar name={user.displayName} photoUrl={user.photoUrl} emoji={user.avatarEmoji} color={user.avatarColor} size={88} />
        <div className="space-y-2">
          <p className="font-bold">Profile photo</p>
          <p className="qp-muted text-sm">A clear photo of your face. JPG, PNG, WebP or GIF under 5 MB.</p>
          <label className="qp-btn qp-btn-ghost cursor-pointer px-4 py-2 text-sm">
            {uploading ? "Uploading…" : user.photoUrl ? "Change photo" : "Add a photo"}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={uploadPhoto} disabled={uploading} />
          </label>
        </div>
      </section>

      <form onSubmit={save} className="space-y-6">
        <section className="qp-card grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <label className="qp-label" htmlFor="displayName">First name</label>
            <input id="displayName" className="qp-input" required maxLength={40} value={form.displayName} onChange={set("displayName")} />
          </div>
          <div>
            <label className="qp-label" htmlFor="age">Age</label>
            <input id="age" className="qp-input" type="number" min={18} max={99} required value={form.age} onChange={set("age")} />
          </div>
          <div>
            <label className="qp-label" htmlFor="gender">I am</label>
            <select id="gender" className="qp-input" value={form.gender} onChange={set("gender")}>
              <option value="">Choose one</option>
              {GENDERS.map((g) => <option key={g}>{g}</option>)}
              {form.gender && !GENDERS.includes(form.gender) && <option>{form.gender}</option>}
            </select>
          </div>
          <div>
            <label className="qp-label" htmlFor="orientation">Looking for</label>
            <select id="orientation" className="qp-input" value={form.orientation} onChange={set("orientation")}>
              <option value="">Choose one</option>
              {LOOKING_FOR.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              {form.orientation && !LOOKING_FOR.some((o) => o.value === form.orientation) && <option>{form.orientation}</option>}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="qp-label" htmlFor="city">City</label>
            <input id="city" className="qp-input" maxLength={60} value={form.city} onChange={set("city")} />
          </div>
          <div className="sm:col-span-2">
            <label className="qp-label" htmlFor="bio">About you</label>
            <textarea id="bio" className="qp-input min-h-[110px]" maxLength={500} value={form.bio} onChange={set("bio")} placeholder="A few lines about what you enjoy and what you're looking for." />
          </div>
        </section>

        <section className="qp-card space-y-4 p-5">
          <div>
            <h2 className="text-xl font-bold">Prompts</h2>
            <p className="qp-muted text-sm">Pick up to three. They give people an easy way to start a conversation.</p>
          </div>
          {prompts.map((p, i) => (
            <div key={i} className="space-y-2 rounded-2xl p-3" style={{ background: "var(--qp-bg)" }}>
              <label className="qp-label" htmlFor={`pq${i}`}>Prompt {i + 1}</label>
              <select id={`pq${i}`} className="qp-input" value={p.question} onChange={(e) => setPrompt(i, { question: e.target.value })}>
                <option value="">Choose a prompt</option>
                {bank.filter((q) => q === p.question || !usedQuestions.has(q)).map((q) => <option key={q}>{q}</option>)}
                {p.question && !bank.includes(p.question) && <option>{p.question}</option>}
              </select>
              <label className="sr-only" htmlFor={`pa${i}`}>Your answer</label>
              <textarea id={`pa${i}`} className="qp-input" maxLength={300} placeholder="Your answer" value={p.answer} onChange={(e) => setPrompt(i, { answer: e.target.value })} />
              <button type="button" className="qp-muted text-sm underline" onClick={() => setPrompts((list) => list.filter((_, j) => j !== i))}>
                Remove
              </button>
            </div>
          ))}
          {prompts.length < 3 && (
            <button type="button" className="qp-btn qp-btn-ghost px-4 py-2 text-sm" onClick={() => setPrompts((l) => [...l, { question: "", answer: "" }])}>
              Add a prompt
            </button>
          )}
        </section>

        <section className="qp-card space-y-3 p-5">
          <div>
            <h2 className="text-xl font-bold">Interests</h2>
            <p className="qp-muted text-sm">Shared interests raise your match score with people.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => (
              <button key={i} type="button" className="qp-chip qp-chip-teal" onClick={() => setInterests((l) => l.filter((x) => x !== i))} aria-label={`Remove ${i}`}>
                {i} ✕
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <label htmlFor="interest" className="sr-only">Add an interest</label>
            <input
              id="interest"
              className="qp-input"
              placeholder="Add an interest"
              maxLength={30}
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInterest(newInterest);
                }
              }}
            />
            <button type="button" className="qp-btn qp-btn-ghost py-2" onClick={() => addInterest(newInterest)}>Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_INTERESTS.filter((s) => !interests.includes(s)).map((s) => (
              <button key={s} type="button" className="qp-chip" onClick={() => addInterest(s)}>+ {s}</button>
            ))}
          </div>
        </section>

        {error && <p className="qp-error" role="alert">{error}</p>}
        {notice && <p role="status" style={{ color: "var(--qp-teal)" }} className="font-semibold">{notice}</p>}
        <div className="flex flex-wrap gap-3">
          <button className="qp-btn qp-btn-primary" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button>
          {welcome && <Link href={qp("discover")} className="qp-btn qp-btn-ghost">Start discovering</Link>}
        </div>
      </form>

      <ProfileExtras userId={user.id} />
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={<p className="qp-muted">Loading…</p>}>
      <ProfileForm />
    </Suspense>
  );
}
