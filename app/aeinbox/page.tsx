import { cookies } from "next/headers"
import Image from "next/image"
import { supabaseFromJWT } from "@/lib/supabase"

export default async function AEinboxPage() {
  const cookieStore = cookies()

  const accessToken =
    cookieStore.get("sb-access-token")?.value ??
    cookieStore.get("supabase-auth-token")?.value

  let isSubscribed = false

  // ✅ NEVER allow server render to throw
  try {
    if (accessToken) {
      const supabase = supabaseFromJWT(accessToken)

      const { data, error } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("status", "active")
        .single()

      if (!error && data) {
        isSubscribed = true
      }
    }
  } catch (err) {
    console.error("ÆInbox subscription check failed", err)
  }

  return (
    <main style={{ maxWidth: 1100, margin: "auto", padding: "60px 20px" }}>
      {/* ✨ subtle glow animation */}
      <style>{`
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 14px rgba(0,255,163,0.35); }
          50% { box-shadow: 0 0 26px rgba(0,255,163,0.65); }
          100% { box-shadow: 0 0 14px rgba(0,255,163,0.35); }
        }
      `}</style>

      {/* 🧠 HERO / BRAND */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: 80,
        }}
      >
        <Image
          src="/aeinbox-wordmark.png"
          alt="ÆInbox"
          width={340}
          height={80}
          priority
        />

        <p style={{ marginTop: 24, fontSize: "1.15rem" }}>
          <strong>Secure Email. Intelligent Assistant. Human-First.</strong>
        </p>

        <p style={{ maxWidth: 520, marginTop: 10, opacity: 0.9 }}>
          ÆInbox is a private inbox with a built-in AI assistant called{" "}
          <strong>Æi</strong>. No ads. No tracking. No data selling.
        </p>

        {!accessToken && (
          <a
            href="/login"
            style={{
              marginTop: 30,
              padding: "15px 34px",
              background: "#00ffa3",
              color: "#000",
              fontWeight: "bold",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            Log in to get started
          </a>
        )}

        {accessToken && !isSubscribed && (
          <a
            href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL}
            style={{
              marginTop: 30,
              padding: "15px 34px",
              background: "#00ffa3",
              color: "#000",
              fontWeight: "bold",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            Start with Æi — $10/month
          </a>
        )}
      </div>

      {/* ✅ ACTIVE SUBSCRIPTION */}
      {isSubscribed && (
        <div
          style={{
            margin: "0 auto 80px",
            padding: 20,
            maxWidth: 520,
            border: "1px solid #00ffa3",
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          <h2>Welcome to ÆInbox ✅</h2>
          <p>Your subscription is active.</p>
          <p>ÆInbox features will appear here as they come online.</p>

          <a
            href="https://billing.stripe.com/p/login/fZufZhdrd5yD0BTfzRaEE00"
            style={{ color: "#00ffa3" }}
          >
            Manage billing
          </a>
        </div>
      )}

      <h2>What ÆInbox Gives You</h2>

      <ul>
        <li>🔐 Privacy-first email</li>
        <li>🤖 Built-in AI assistant (Æi)</li>
        <li>🛡️ Phishing & threat awareness</li>
        <li>🌑 Clean dark-mode interface</li>
      </ul>

      {/* 🤖 Æi SECTION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginTop: 80,
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 18,
            background: "rgba(0,255,163,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulseGlow 3.5s ease-in-out infinite",
          }}
        >
          <Image
            src="/aei.png"
            alt="Æi Assistant"
            width={48}
            height={48}
          />
        </div>

        <h2 style={{ margin: 0 }}>Meet Æi</h2>
      </div>

      <p style={{ marginTop: 12, maxWidth: 520 }}>
        Æi drafts replies, summarizes long threads, and helps you spot suspicious
        emails — so you stay focused, not flooded.
      </p>

      <p style={{ marginTop: 80, opacity: 0.7, textAlign: "center" }}>
        Powered by Archway Power
      </p>
    </main>
  )
}
