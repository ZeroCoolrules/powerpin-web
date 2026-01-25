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

		// ✅ DO NOT auto-login
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
          borderRadius: 18,
          background: "rgba(15,23,32,0.9)",
          border: "1px solid #1f2937",
          boxShadow: "0 0 60px rgba(0,255,163,0.15)",
        }}
      >
        {/* 🧠 BRAND WORDMARK */}
		<div style={{ textAlign: "center", marginBottom: 40 }}>
		  <Image
			src="/aeinbox-wordmark.png"
			alt="ÆInbox"
			width={340}
			height={80}
			priority
		  />
		</div>

          <p style={{ marginTop: 10, opacity: 0.8 }}>
            Create your ÆInbox account
          </p>
        
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

        {error && (
          <div style={{ marginTop: 12, color: "#f87171", fontSize: 14 }}>
            {error}
          </div>
        )}

        <button
          disabled={loading}
          style={{
            marginTop: 22,
            width: "100%",
            padding: "14px 0",
            borderRadius: 999,
            background: "#00ffa3",
            color: "#000",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 0 40px rgba(0,255,163,0.45)",
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
