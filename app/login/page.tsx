"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export default function LoginPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔁 Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/aeinbox")
      }
    })
  }, [router, supabase])

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

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
        <h1 style={{ marginBottom: 20 }}>Sign in</h1>

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
          <div style={{ color: "#f87171", marginTop: 10 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            background: "#00ffa3",
            color: "#000",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
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
  width: 380,
  padding: 28,
  borderRadius: 18,
  background: "rgba(15,23,32,0.9)",
  border: "1px solid #1f2937",
}

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  background: "#000",
  border: "1px solid #1f2937",
  color: "#e6eaf0",
  outline: "none",
  marginBottom: 12,
}
