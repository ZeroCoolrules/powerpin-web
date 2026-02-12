"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import PasswordInput from "../components/PasswordInput"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const passwordValid = useMemo(() => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    )
  }, [password])

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!passwordValid || loading) return

    setLoading(true)
    setError(null)

    try {
      const supabase = supabaseBrowser()

      // IMPORTANT: use the current origin (handles www vs non-www + preview domains)
      const emailRedirectTo = new URL("/auth/callback", window.location.origin).toString()

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setLoading(false)
      router.push("/register/check-email")
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "register_failed")
      setLoading(false)
    }
  }

  return (
    <div style={container}>
      <form onSubmit={handleRegister} style={card}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Image
            src="/aemail-wordmark.png"
            alt="Æmail"
            width={300}
            height={70}
            priority
          />
          <p style={{ marginTop: 14, opacity: 0.8 }}>Create your ÆInbox account</p>
        </div>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <PasswordInput value={password} onChange={setPassword} placeholder="Password" />

        <ul style={{ fontSize: 12, marginTop: 6 }}>
          <Rule ok={password.length >= 8} label="At least 8 characters" />
          <Rule ok={/[A-Z]/.test(password)} label="Uppercase letter" />
          <Rule ok={/[a-z]/.test(password)} label="Lowercase letter" />
          <Rule ok={/\d/.test(password)} label="Number" />
          <Rule ok={/[^A-Za-z0-9]/.test(password)} label="Special character" />
        </ul>

        {error && <div style={{ marginTop: 10, color: "#f87171" }}>{error}</div>}

        <button
          type="submit"
          disabled={!passwordValid || loading}
          style={{
            marginTop: 22,
            width: "100%",
            padding: "14px 0",
            borderRadius: 999,
            background: passwordValid ? "#00ffa3" : "#064e3b",
            color: "#000",
            fontWeight: 700,
            cursor: passwordValid ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  )
}

function Rule({ ok, label }: { ok: boolean; label: string }) {
  return <li style={{ color: ok ? "#00ffa3" : "#6b7280" }}>• {label}</li>
}

const container: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#000",
  color: "#e6eaf0",
}

const card: React.CSSProperties = {
  width: 420,
  padding: 32,
  borderRadius: 20,
  background: "rgba(15,23,32,0.9)",
  border: "1px solid #1f2937",
  boxShadow: "0 0 60px rgba(0,255,163,0.15)",
}

const input: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  background: "#000",
  border: "1px solid #1f2937",
  color: "#e6eaf0",
  outline: "none",
}
