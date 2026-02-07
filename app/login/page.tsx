"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

   useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/aeinbox")
      }
    })
  }, [router])

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push("/aeinbox")
  }

  return (
    <div style={container}>
      <form onSubmit={signIn} style={card}>
        <h2 style={{ marginBottom: 20 }}>Sign in</h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        {error && (
          <div style={{ color: "#f87171", fontSize: 14, marginBottom: 10 }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} style={button}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  )
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
  marginBottom: 12,
  borderRadius: 12,
  background: "#000",
  border: "1px solid #1f2937",
  color: "#e6eaf0",
  outline: "none",
}

const button: React.CSSProperties = {
  width: "100%",
  padding: "14px 0",
  borderRadius: 999,
  background: "#00ffa3",
  color: "#000",
  fontWeight: 700,
  cursor: "pointer",
}
