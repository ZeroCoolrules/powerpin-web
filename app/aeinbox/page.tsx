import { cookies } from "next/headers"
import Image from "next/image"
import { supabaseFromJWT } from "@/lib/supabase"

/* ===============================
   SERVER PAGE
================================ */
export default async function AEinboxPage() {
  const cookieStore = cookies()

  const accessToken =
    cookieStore.get("sb-access-token")?.value ??
    cookieStore.get("supabase-auth-token")?.value

  let isSubscribed = false

  try {
    if (accessToken) {
      const supabase = supabaseFromJWT(accessToken)
      const { data, error } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("status", "active")
        .single()

      if (!error && data) isSubscribed = true
    }
  } catch {
    // never crash landing page
  }

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "auto",
        padding: "100px 20px",
        textAlign: "center",
      }}
    >
      {/* BRAND */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 48,
        }}
      >
        <Image
          src="/aeinbox-wordmark.png"
          alt="ÆInbox"
          width={340}
          height={80}
          priority
        />
      </div>

      {/* HERO */}
      <h1 style={{ marginTop: 40, fontSize: "2.4rem", fontWeight: 600 }}>
        Secure Email. Intelligent Assistant. Human-First.
      </h1>

      <p
        style={{
          marginTop: 16,
          fontSize: "1.15rem",
          opacity: 0.85,
          maxWidth: 720,
          marginInline: "auto",
        }}
      >
        ÆInbox is a private inbox with a built-in AI assistant called{" "}
        <strong>Æi</strong>. No ads. No tracking. No data selling.
      </p>

      {/* LOGIN / REGISTER */}
      {!accessToken && (
        <div style={{ marginTop: 40 }}>
          <a
            href="/login"
            style={{
              display: "inline-block",
              padding: "16px 42px",
              background: "#00ffa3",
              color: "#000",
              fontWeight: "bold",
              borderRadius: 999,
              textDecoration: "none",
              boxShadow: "0 0 40px rgba(0,255,163,0.45)",
            }}
          >
            Log in to get started
          </a>

          <div style={{ marginTop: 16, fontSize: 14, opacity: 0.85 }}>
            New here?{" "}
            <a href="/register" style={{ color: "#00ffa3", fontWeight: 600 }}>
              Create an account
            </a>
          </div>
        </div>
      )}

      {/* SUBSCRIBE */}
      {accessToken && !isSubscribed && (
        <form action="/api/checkout" method="POST" style={{ marginTop: 40 }}>
          <button
            type="submit"
            style={{
              padding: "16px 42px",
              background: "#00ffa3",
              color: "#000",
              fontWeight: "bold",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 40px rgba(0,255,163,0.45)",
            }}
          >
            Start with Æi — $10/month
          </button>
        </form>
      )}

      {/* MANAGE SUBSCRIPTION */}
      {accessToken && isSubscribed && (
        <form action="/api/portal" method="POST" style={{ marginTop: 40 }}>
          <button
            type="submit"
            style={{
              padding: "14px 36px",
              background: "#0a0a0a",
              color: "#00ffa3",
              border: "1px solid #00ffa3",
              borderRadius: 999,
              cursor: "pointer",
            }}
          >
            Manage subscription
          </button>
        </form>
      )}

      {/* FEATURES */}
      <h2 style={{ marginTop: 90, fontSize: "1.9rem", fontWeight: 600 }}>
        What ÆInbox Gives You
      </h2>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          marginTop: 24,
          fontSize: "1.05rem",
          lineHeight: "2.2rem",
        }}
      >
        <li>🔐 Privacy-first email</li>
        <li>🤖 Built-in AI assistant (Æi)</li>
        <li>🛡️ Phishing & threat awareness</li>
        <li>🌑 Clean dark-mode interface</li>
      </ul>

      {/* Æi CARD */}
      <div
        style={{
          marginTop: 90,
          padding: "50px 30px",
          borderRadius: 28,
          background: "rgba(255,255,255,0.03)",
          boxShadow: "0 0 120px rgba(0,255,163,0.18)",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            margin: "0 auto",
            borderRadius: 26,
            overflow: "hidden",
            boxShadow: "0 0 35px rgba(0,255,163,0.6)",
            animation: "pulse 3s ease-in-out infinite",
          }}
        >
          <Image src="/aei.png" alt="Æi Assistant" width={96} height={96} />
        </div>

        <h1 style={{ marginTop: 22 }}>Meet Æi</h1>

        <p
          style={{
            marginTop: 12,
            fontSize: "1.05rem",
            opacity: 0.8,
            maxWidth: 600,
            marginInline: "auto",
          }}
        >
          Æi drafts replies, summarizes long threads, and helps you spot
          suspicious emails — so you stay focused, not flooded.
        </p>
      </div>

      <p style={{ marginTop: 90, opacity: 0.6 }}>
        Powered by Archway Power
      </p>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 25px rgba(0,255,163,0.4); }
          50% { box-shadow: 0 0 55px rgba(0,255,163,0.8); }
          100% { box-shadow: 0 0 25px rgba(0,255,163,0.4); }
        }
      `}</style>
    </main>
  )
}
