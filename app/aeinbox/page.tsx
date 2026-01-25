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
  } catch {
    // fail silently
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
      {/* BRAND */}
      <Image
        src="/aeinbox-wordmark.png"
        alt="ÆInbox"
        width={360}
        height={90}
        priority
        style={{ margin: "0 auto" }}
      />

      {/* HERO */}
      <h1
        style={{
          marginTop: 30,
          fontSize: "1.4rem",
          fontWeight: 600,
          letterSpacing: 0.3,
        }}
      >
        Secure Email. Intelligent Assistant. Human-First.
      </h1>

      <p
        style={{
          marginTop: 14,
          maxWidth: 620,
          marginInline: "auto",
          opacity: 0.85,
          lineHeight: 1.6,
        }}
      >
        ÆInbox is a private inbox with a built-in AI assistant called{" "}
        <strong>Æi</strong>. No ads. No tracking. No data selling.
      </p>

      {/* CTA */}
      {!accessToken && (
        <a
          href="/login"
          style={{
            display: "inline-block",
            marginTop: 36,
            padding: "16px 44px",
            background: "#00ffa3",
            color: "#000",
            fontWeight: 700,
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
            padding: "16px 44px",
            background: "#00ffa3",
            color: "#000",
            fontWeight: 700,
            borderRadius: 999,
            textDecoration: "none",
            boxShadow: "0 0 30px rgba(0,255,163,0.35)",
          }}
        >
          Unlock Æi — $10 / month
        </a>
      )}

      {isSubscribed && (
        <div
          style={{
            marginTop: 40,
            padding: 24,
            border: "1px solid #00ffa3",
            borderRadius: 16,
            display: "inline-block",
          }}
        >
          <strong>Subscription active ✅</strong>
          <div style={{ marginTop: 8 }}>
            <a
              href="https://billing.stripe.com/p/login/fZufZhdrd5yD0BTfzRaEE00"
              style={{ color: "#00ffa3" }}
            >
              Manage billing
            </a>
          </div>
        </div>
      )}

      {/* FEATURES */}
      <section style={{ marginTop: 90 }}>
        <h2 style={{ marginBottom: 24 }}>What ÆInbox Gives You</h2>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            lineHeight: 2,
            opacity: 0.9,
          }}
        >
          <li>🔐 Privacy-first email</li>
          <li>🤖 Built-in AI assistant (Æi)</li>
          <li>🛡️ Phishing & threat awareness</li>
          <li>🌑 Clean dark-mode interface</li>
        </ul>
      </section>

      {/* Æi CARD */}
      <section
        style={{
          marginTop: 100,
          padding: "48px 24px",
          borderRadius: 28,
          background:
            "radial-gradient(circle at top, rgba(0,255,163,0.08), transparent 60%)",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            margin: "0 auto",
            borderRadius: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#05080c",
            animation: "breath 4s ease-in-out infinite",
            boxShadow: "0 0 0 rgba(0,255,163,0.0)",
          }}
        >
          <Image src="/aei.png" alt="Æi" width={52_attach} height={52} />
        </div>

        <h2 style={{ marginTop: 22 }}>Meet Æi</h2>

        <p
          style={{
            maxWidth: 600,
            margin: "12px auto 0",
            opacity: 0.85,
          }}
        >
          Æi drafts replies, summarizes long threads, and helps you spot suspicious
          emails — so you stay focused, not flooded.
        </p>
      </section>

      <p style={{ marginTop: 80, opacity: 0.5 }}>
        Powered by Archway Power
      </p>

      {/* BREATHING ANIMATION */}
      <style>{`
        @keyframes breath {
          0% { box-shadow: 0 0 12px rgba(0,255,163,0.25); }
          50% { box-shadow: 0 0 36px rgba(0,255,163,0.55); }
          100% { box-shadow: 0 0 12px rgba(0,255,163,0.25); }
        }
      `}</style>
    </main>
  )
}
