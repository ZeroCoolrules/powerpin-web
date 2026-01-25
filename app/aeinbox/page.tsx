import { cookies } from "next/headers"
import { supabaseFromJWT } from "@/lib/supabase"

export default async function AEinboxPage() {
  const cookieStore = cookies()

  // Supabase stores the access token in cookies
  const accessToken =
    cookieStore.get("sb-access-token")?.value ??
    cookieStore.get("supabase-auth-token")?.value

  let isSubscribed = false

  if (accessToken) {
    const supabase = supabaseFromJWT(accessToken)

    const { data } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("status", "active")
      .single()

    if (data) {
      isSubscribed = true
    }
  }

  return (
    <main style={{ maxWidth: 1100, margin: "auto", padding: "60px 20px" }}>
      <img
		src="/aeinbox-wordmark.png"
		alt="ÆInbox"
		style={{ height: 56, marginBottom: 20 }}
	 />
	 <img src="/aei.png" alt="Æi" width={32} />

      <p>
        <strong>Secure Email. Intelligent Assistant. Human-First.</strong>
      </p>

      <p>
        ÆInbox is a private inbox with a built-in AI assistant called{" "}
        <strong>Æi</strong>. No ads. No tracking. No data selling.
      </p>

      {/* 🔒 LOGIN GATE */}
      {!accessToken && (
        <a
          href="/aeinbox/login"
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

          <p>
            ÆInbox features will appear here as they come online.
          </p>

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

      <h2 style={{ marginTop: 60 }}>Meet Æi</h2>

      <p>
        Æi drafts replies, summarizes long threads, and helps you spot suspicious
        emails — so you stay focused, not flooded.
      </p>

      <p style={{ marginTop: 60, opacity: 0.7 }}>
        Powered by Archway Power
      </p>
    </main>
  )
}
