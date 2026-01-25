import { cookies } from "next/headers"
import Image from "next/image"
import { supabaseFromJWT } from "@/lib/supabase"

export default async function AEinboxPage() {
  const cookieStore = cookies()

  // Supabase stores the access token in cookies
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
      {/* 🧠 BRAND WORDMARK */}
      <Image
        src="/aeinbox-wordmark.png"
        alt="ÆInbox"
        width={340}
        height={80}
        priority
      />

      <p style={{ marginTop: 20 }}>
        <strong>Secure Email. Intelligent Assistant. Human-First.</strong>
      </p>

      <p>
        ÆInbox is a private inbox with a built-in AI assistant called{" "}
        <strong>Æi</strong>. No ads. No tracking. No data selling.
      </p>

      {/* 🔒 LOGIN GATE */}
      {!accessToken && (
        <a
          href="/login"
          style={{
            display: "inline-block",
            marginTop: 25,
            padding: "15px 30px",
            background: "#00ffa3",
            color: "#000",
            fontWeight: "bold",
            borderRadius: 8,
            textDecoration: "none",
          }}
        >
          Log in to get started
        </a>
      )}

      {/* 💳 SUBSCRIPTION GATE */}
      {accessToken && !isSubscribed && (
        <a
          href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL}
          style={{
            display: "inline-block",
            marginTop: 25,
            padding: "15px 30px",
            background: "#00ffa3",
            color: "#000",
            fontWeight: "bold",
            borderRadius: 8,
            textDecoration: "none",
          }}
        >
          Start with Æi — $10/month
        </a>
      )}

      {/* ✅ ACTIVE SUBSCRIPTION */}
      {isSubscribed && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            border: "1px solid #00ffa3",
            borderRadius: 10,
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

      <h2 style={{ marginTop: 60 }}>What ÆInbox Gives You</h2>

      <ul>
        <li>🔐 Privacy-first email</li>
        <li>🤖 Built-in AI assistant (Æi)</li>
        <li>🛡️ Phishing & threat awareness</li>
        <li>🌑 Clean dark-mode interface</li>
      </ul>

      {/* 🤖 Æi SECTION — ICON BELONGS HERE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 60,
        }}
      >
        <Image
          src="/aei.png"
          alt="Æi Assistant"
          width={72}
          height={72}
          style={{
            filter: "drop-shadow(0 0 14px rgba(0,255,163,0.6))",
          }}
        />

        <h2 style={{ margin: 0 }}>Meet Æi</h2>
      </div>

      <p style={{ marginTop: 12 }}>
        Æi drafts replies, summarizes long threads, and helps you spot suspicious
        emails — so you stay focused, not flooded.
      </p>

      <p style={{ marginTop: 60, opacity: 0.7 }}>
        Powered by Archway Power
      </p>
    </main>
  )
}
