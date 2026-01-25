"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)

  async function signUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://inboxae.com/login",
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // Do NOT auto-login
    router.push("/register/check-email")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#e6eaf0",
      }}
    >
      <form
        onSubmit={signUp}
        style={{
          width: 420,
          padding: 32,
          borderRadius: 20,
          background: "rgba(15,23,32,0.9)",
          border: "1px solid #1f2937",
          boxShadow: "0 0 60px rgba(0,255,163,0.15)",
        }}
      >
        {/* BRAND */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Image
            src="/aeinbox-wordmark.png"
            alt="ÆInbox"
            width={300}
            height={70}
            priority
          />
          <p style={{ marginTop: 14, opacity: 0.8 }}>
            Create your ÆInbox account
          </p>
        </div>

        <input
          type="email"
          placeholder="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ ...inputStyle, marginTop: 14 }}
        />

        {/* PASSWORD RULES */}
        <p style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
          Password must be at least 8 characters, include uppercase, lowercase,
          a number, and a special character.
        </p>

        <ul style={{ fontSize: 12, marginTop: 6, opacity: 0.85 }}>
          <li style={{ color: password.length >= 8 ? "#00ffa3" : "#6b7280" }}>
            • At least 8 characters
          </li>
          <li style={{ color: /[A-Z]/.test(password) ? "#00ffa3" : "#6b7280" }}>
            • Uppercase letter
          </li>
          <li style={{ color: /[a-z]/.test(password) ? "#00ffa3" : "#6b7280" }}>
            • Lowercase letter
          </li>
          <li style={{ color: /\d/.test(password) ? "#00ffa3" : "#6b7280" }}>
            • Number
          </li>
          <li
            style={{
              color: /[^A-Za-z0-9]/.test(password) ? "#00ffa3" : "#6b7280",
            }}
          >
            • Special character
          </li>
        </ul>

        {error && (
          <div style={{ marginTop: 12, color: "#f87171", fontSize: 14 }}>
            {error}
          </div>
        )}

        <button
          disabled={loading || !passwordValid}
          style={{
            marginTop: 22,
            width: "100%",
            padding: "14px 0",
            borderRadius: 999,
            background: passwordValid ? "#00ffa3" : "#064e3b",
            color: "#000",
            fontWeight: 700,
            cursor: loading || !passwordValid ? "not-allowed" : "pointer",
            boxShadow: passwordValid
              ? "0 0 40px rgba(0,255,163,0.45)"
              : "none",
          }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <div
          style={{
            marginTop: 22,
            textAlign: "center",
            fontSize: 14,
            opacity: 0.8,
          }}
        >
          Already have an account?{" "}
          <a href="/login" style={{ color: "#00ffa3" }}>
            Log in
          </a>
        </div>
      </form>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  background: "#000",
  border: "1px solid #1f2937",
  color: "#e6eaf0",
  outline: "none",
}
