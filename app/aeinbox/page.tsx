import { cookies } from "next/headers"
import Image from "next/image"
import { supabaseFromJWT } from "@/lib/supabase"

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
  } catch (err) {
    console.error("ÆInbox subscription check failed", err)
  }

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "auto",
        padding: "80px 20px",
        textAlign: "center",
      }}
    >
      {/* 🧠 HERO */}
      <section style={{ marginBottom: 90 }}>
        <Image
          src="/aeinbox-wordmark.png"
          alt="ÆInbox"
          width={360}
          height={84}
          priority
        />

        <p style={{ marginTop: 24, fontSize: "1.25rem", fontWeight: 600 }}>
          Secure Email. Intelligent Assistant. Human-First.
        </p>

        <p
          style={{
            maxWidth: 640,
            margin: "16px auto 0",
            opacity: 0.85,
            fontSize: "1.05rem",
          }}
        >
          ÆInbox is a private inbox with a built-in AI assistant called{" "}
          <strong>Æi</strong>. No ads. No tracking. No data selling.
        </p>

        {!accessToken && (
          <a
            href="/login"
            style={{
              display: "inline-block",
              marginTop: 36,
              padding: "16px 38px",
              background: "#00ffa3",
              color: "#000",
              fontWeight: "bold",
              borderRadius: 999,
              textDecoration: "none",
              boxShadow: "0 0 30px rgba(0,255,163,0.35)",
            }}
          >
            Log in to get started
          </a>
        )}

        {accessToken && !isSubscribed && (
          <a
            href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL}
            style={{
              display: "inline-block",
              marginTop: 36,
              padding: "16px 38px",
              background: "#00ffa3",
              color: "#000",
              fontWeight: "bold",
              borderRadius: 999,
              textDecoration: "none",
              boxShadow: "0 0 30px rgba(0,255,163,0.35)",
            }}
          >
            Start with Æi — $10/month
          </a>
        )}
      </section>

      {/* ✨ FEATURES */}
      <section style={{ marginBottom: 90 }}>
        <h2>What ÆInbox Gives You</h2>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            marginTop: 28,
            display: "grid",
            gap: 14,
            maxWidth: 420,
            marginInline: "auto",
            textAlign: "left",
          }}
        >
          <li>🔐 Privacy-first email</li>
          <li>🤖 Built-in AI assistant (Æi)</li>
          <li>🛡️ Phishing & threat awareness</li>
          <li>🌑 Clean dark-mode interface</li>
        </ul>
      </section>

      {/* 🤖 Æi FEATURE */}
      <section
        style={{
          marginBottom: 90,
          padding: "44px 32px",
          borderRadius: 28,
          background: "rgba(255,255,255,0.03)",
          boxShadow: "0 0 60px rgba(0,255,163,0.12)",
          maxWidth: 720,
          marginInline: "auto",
        }}
      >
        {/* ROUNDED MASK — hides black square */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 28,
            background: "#0b0f14",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
            boxShadow: "0 0 28px rgba(0,255,163,0.6)",
            overflow: "hidden", // 👈 THIS CUTS OFF THE CORNERS
          }}
        >
          <Image
            src="/aei.png"
            alt="Æi Assistant"
            width={56}
            height={56}
          />
        </div>

        <h2 style={{ marginBottom: 12 }}>Meet Æi</h2>

        <p style={{ maxWidth: 520, margin: "0 auto", opacity: 0.85 }}>
          Æi drafts replies, summarizes long threads, and helps you spot
          suspicious emails — so you stay focused, not flooded.
        </p>
      </section>

      {/* FOOTER */}
      <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>
        Powered by Archway Power
      </p>
    </main>
  )
}
