import Image from "next/image"
import { cookies } from "next/headers"
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
    // never crash landing page
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0f14",
        color: "#e6eaf0",
        padding: "80px 20px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto", textAlign: "center" }}>
        {/* LOGO */}
        <div style={{ marginBottom: 40 }}>
          <Image
            src="/aeinbox-wordmark.png"
            alt="ÆInbox"
            width={320}
            height={80}
            priority
          />
        </div>

        {/* HERO */}
        <h1 style={{ fontSize: "3rem", marginBottom: 12 }}>
          Secure Email. Intelligent Assistant. Human-First.
        </h1>

        <p
          style={{
            maxWidth: 720,
            margin: "0 auto",
            fontSize: "1.15rem",
            opacity: 0.85,
          }}
        >
          ÆInbox is a private inbox with a built-in AI assistant called{" "}
          <strong>Æi</strong>. No ads. No tracking. No data selling.
        </p>

        {/* CTA */}
        {!accessToken && (
          <div style={{ marginTop: 40 }}>
            <a
              href="/login"
              style={ctaStyle}
            >
              Log in to get started
            </a>

            <div style={{ marginTop: 12, fontSize: 14 }}>
              New here?{" "}
              <a href="/register" style={{ color: "#00ffa3" }}>
                Create an account
              </a>
            </div>
          </div>
        )}

        {accessToken && !isSubscribed && (
          <div style={{ marginTop: 40 }}>
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL}
              style={ctaStyle}
            >
              Start with Æi — $10/month
            </a>
          </div>
        )}

        {accessToken && isSubscribed && (
          <div style={{ marginTop: 40 }}>
            <a
              href="/api/stripe/portal"
              style={{
                ...ctaStyle,
                background: "transparent",
                color: "#00ffa3",
                border: "2px solid #00ffa3",
              }}
            >
              Manage billing
            </a>
          </div>
        )}

        {/* FEATURES */}
        <section style={{ marginTop: 90 }}>
          <h2 style={{ fontSize: "2rem", marginBottom: 24 }}>
            What Makes ÆInbox Different
          </h2>

          <ul style={featureListStyle}>
            <li>🔐 Privacy-first email (no data selling)</li>
            <li>🤖 AI that writes, summarizes, and protects</li>
            <li>🛡️ Built-in phishing & threat detection</li>
            <li>🌑 Clean dark-mode interface</li>
          </ul>
        </section>

        {/* AI SECTION */}
        <section style={{ marginTop: 90 }}>
          <h2 style={{ fontSize: "2rem", marginBottom: 20 }}>
            Meet Æi — Your AI Assistant
          </h2>

          <p style={{ maxWidth: 680, margin: "0 auto", opacity: 0.8 }}>
            Æi drafts replies, summarizes long threads, flags suspicious emails,
            and helps you stay focused — not flooded.
          </p>
        </section>

        {/* PRICING */}
        <section style={{ marginTop: 90 }}>
          <h2 style={{ fontSize: "2rem", marginBottom: 30 }}>Pricing</h2>

          <div style={pricingGridStyle}>
            <div style={priceCardStyle}>$5 — Secure Email</div>
            <div style={{ ...priceCardStyle, borderColor: "#00ffa3" }}>
              <strong>$10 — Secure Email + AI</strong>
            </div>
            <div style={priceCardStyle}>$15 — Pro (Coming Soon)</div>
          </div>
        </section>

        {/* TRUST */}
        <section style={{ marginTop: 90 }}>
          <p style={{ opacity: 0.7 }}>
            No ads · No tracking · Cancel anytime · Human-first technology
          </p>
        </section>

        {/* FOOTER */}
        <footer style={{ marginTop: 120, fontSize: 13, opacity: 0.6 }}>
          Powered by Archway Power · © 2026 ÆInbox
        </footer>
      </div>
    </main>
  )
}

/* styles */
const ctaStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "16px 42px",
  background: "#00ffa3",
  color: "#000",
  fontWeight: "bold",
  borderRadius: 999,
  textDecoration: "none",
  boxShadow: "0 0 40px rgba(0,255,163,0.45)",
}

const featureListStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  fontSize: "1.05rem",
  lineHeight: "2.2rem",
}

const pricingGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
}

const priceCardStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.15)",
  padding: 24,
  borderRadius: 16,
  background: "rgba(255,255,255,0.03)",
}
