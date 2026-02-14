"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabaseBrowser } from "@/lib/supabase-browser"

export const dynamic = "force-dynamic"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = supabaseBrowser()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }
	await fetch("/api/2fa/send", { method: "POST" })

    const { data: profile } = await supabase
  .from("profiles")
  .select("twofa_enabled")
  .eq("user_id", session.user.id)
  .single()

	 if (profile?.twofa_enabled) {
	router.replace("/2fa")
	} else {
	router.replace("/aeinbox/inbox")
	}

  }

  return (
    <div style={container}>
      {/* STARFIELD BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="stars" />
      </div>

      {/* LOGIN CARD */}
      <div style={card}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Image
            src="/aemail-wordmark.png"
            alt="AEmail"
            width={220}
            height={60}
            priority
          />
        </div>

        <form onSubmit={signIn}>
          <h2 style={{ marginBottom: 20, textAlign: "center" }}>Sign in</h2>

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <div style={{ position: "relative", marginBottom: 12 }}>
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...input, paddingRight: 52, marginBottom: 0 }}
            />

            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              style={eyeBtn}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? "🙈" : "👁️"}
            </button>
          </div>

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

      {/* STARFIELD CSS */}
      <style jsx>{`
        .stars {
          width: 100%;
          height: 100%;
          background: black;
          background-image:
            radial-gradient(2px 2px at 20px 30px, #00e5ff, transparent),
            radial-gradient(2px 2px at 40px 70px, #00e5ff, transparent),
            radial-gradient(1px 1px at 90px 40px, #00e5ff, transparent),
            radial-gradient(2px 2px at 130px 80px, #00e5ff, transparent),
            radial-gradient(1px 1px at 160px 120px, #00e5ff, transparent);
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: moveStars 8s linear infinite;
          opacity: 0.5;
        }

        @keyframes moveStars {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-200px);
          }
        }
      `}</style>
    </div>
  )
}

/* STYLES */

const container: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#000",
  color: "#e6eaf0",
  position: "relative",
  overflow: "hidden",
}

const card: React.CSSProperties = {
  width: 420,
  padding: 32,
  borderRadius: 20,
  background: "rgba(15,23,32,0.85)",
  border: "1px solid rgba(0,229,255,0.2)",
  boxShadow: "0 0 60px rgba(0,229,255,0.15)",
  backdropFilter: "blur(12px)",
  zIndex: 2,
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
  background: "#00e5ff",
  color: "#000",
  fontWeight: 700,
  cursor: "pointer",
  border: "none",
}

const eyeBtn: React.CSSProperties = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  border: "none",
  background: "transparent",
  color: "#9ca3af",
  cursor: "pointer",
  fontSize: 18,
  padding: 6,
}
