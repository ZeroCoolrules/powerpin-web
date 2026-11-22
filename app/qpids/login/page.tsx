"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, type Member } from "../lib/api";
import { useAuth } from "../lib/auth";
import { qp } from "../lib/paths";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { token, user } = await api<{ token: string; user: Member }>("/auth/login", {
        method: "POST",
        body: { username, password },
      });
      signIn(token, user);
      router.push(qp("discover"));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="qp-card p-6 sm:p-8">
        <h1 className="mb-1 text-3xl font-bold">Welcome back</h1>
        <p className="qp-muted mb-6">Your Cupid's Corner account works here too.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="qp-label" htmlFor="username">Username or email</label>
            <input id="username" className="qp-input" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="qp-label" htmlFor="password">Password</label>
            <input id="password" className="qp-input" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="qp-error" role="alert">{error}</p>}
          <button className="qp-btn qp-btn-primary w-full" disabled={busy}>
            {busy ? "Signing in…" : "Log in"}
          </button>
        </form>
        <p className="qp-muted mt-6 text-center text-sm">
          New here? <Link href={qp("join")} className="font-semibold" style={{ color: "var(--qp-coral)" }}>Join free</Link>
        </p>
      </div>
    </div>
  );
}
