"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api, type Member } from "../lib/api";
import { useAuth } from "../lib/auth";
import { qp } from "../lib/paths";

const GENDERS = ["Woman", "Man", "Nonbinary"];
// The matcher reads "looking for" from this text (women / men / everyone).
const LOOKING = [
  { value: "Interested in men", label: "Men" },
  { value: "Interested in women", label: "Women" },
  { value: "Interested in everyone", label: "Everyone" },
];

function JoinForm() {
  const router = useRouter();
  // An invite link looks like /join?ref=CODE.
  const ref = (useSearchParams().get("ref") || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 16);
  const [invite, setInvite] = useState<{ inviterName: string; welcome: number } | null>(null);
  useEffect(() => {
    if (!ref) return;
    api<{ valid: boolean; inviterName: string; welcome: number }>(`/public/referral/${ref}`)
      .then((r) => setInvite(r.valid ? r : null))
      .catch(() => {});
  }, [ref]);
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    password: "",
    age: "",
    gender: "",
    orientation: "",
    city: "",
    acceptTerms: false,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (Number(form.age) < 18) return setError("You must be 18 or older to join Qpids Place.");
    setBusy(true);
    try {
      const { token, user } = await api<{ token: string; user: Member }>("/auth/signup", {
        method: "POST",
        body: { ...form, age: Number(form.age), avatarEmoji: "💗", avatarColor: "#f0545c", referralCode: ref || undefined },
      });
      signIn(token, user);
      router.push(qp("profile?welcome=1"));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="qp-card p-6 sm:p-8">
        <h1 className="mb-1 text-3xl font-bold">Join Qpids Place</h1>
        <p className="qp-muted mb-6">Free to join. Takes about a minute.</p>
        {invite && (
          <p className="mb-6 rounded-2xl p-3 text-sm" style={{ background: "var(--qp-teal-soft)", color: "var(--qp-teal)" }}>
            {invite.inviterName} invited you.{invite.welcome > 0 ? ` You'll start with ✨ ${invite.welcome} extra sparks.` : ""}
          </p>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="qp-label" htmlFor="displayName">First name</label>
              <input id="displayName" className="qp-input" required maxLength={40} value={form.displayName} onChange={set("displayName")} />
            </div>
            <div>
              <label className="qp-label" htmlFor="age">Age</label>
              <input id="age" className="qp-input" type="number" min={18} max={120} required value={form.age} onChange={set("age")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="qp-label" htmlFor="gender">I am</label>
              <select id="gender" className="qp-input" required value={form.gender} onChange={set("gender")}>
                <option value="">Choose…</option>
                {GENDERS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="qp-label" htmlFor="orientation">Looking for</label>
              <select id="orientation" className="qp-input" required value={form.orientation} onChange={set("orientation")}>
                <option value="">Choose…</option>
                {LOOKING.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="qp-label" htmlFor="city">City</label>
            <input id="city" className="qp-input" maxLength={60} value={form.city} onChange={set("city")} placeholder="Chicago" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="qp-label" htmlFor="username">Username</label>
              <input
                id="username"
                className="qp-input"
                required
                pattern="[A-Za-z0-9_.]{3,24}"
                title="3-24 letters, numbers, dots or underscores"
                autoComplete="username"
                value={form.username}
                onChange={set("username")}
              />
            </div>
            <div>
              <label className="qp-label" htmlFor="password">Password</label>
              <input id="password" className="qp-input" type="password" minLength={8} required autoComplete="new-password" value={form.password} onChange={set("password")} />
            </div>
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1" checked={form.acceptTerms} onChange={set("acceptTerms")} required />
            <span>I'm 18 or older and I agree to the Terms, Privacy Policy and Community Guidelines.</span>
          </label>
          {error && <p className="qp-error" role="alert">{error}</p>}
          <button className="qp-btn qp-btn-primary w-full" disabled={busy}>
            {busy ? "Creating your profile…" : "Create my profile"}
          </button>
        </form>
        <p className="qp-muted mt-6 text-center text-sm">
          Already a member? <Link href={qp("login")} className="font-semibold" style={{ color: "var(--qp-coral)" }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default function Join() {
  return (
    <Suspense fallback={<p className="qp-muted py-20 text-center">Loading…</p>}>
      <JoinForm />
    </Suspense>
  );
}
