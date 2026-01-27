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
    // Never crash landing page
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

      {/* 🔒 LOGIN / REGISTER */}
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

      {/* 💳 NOT SUBSCRIBED */}
      {accessToken && !isSubscribed && (
        <a
          href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL}
          style={{
            display: "inline-block",
            marginTop: 40,
            padding: "16px 42px",
            background: "#00ffa3",
            color: "#000",
            fontWeight: "bold",
            borderRadius: 999,
            textDecoration: "none",
            boxShadow: "0 0 40px rgba(0,255,163,0.45)",
          }}
        >
          Start with Æi — $10/month
        </a>
      )}

      {/* ✅ SUBSCRIBED */}
      {accessToken && isSubscribed && (
        <div style={{ marginTop: 40 }}>
          <a
            href="/aeinbox/app"
            style={{
              display: "inline-block",
              padding: "16px 42px",
              background: "#00ffa3",
              color: "#000",
              fontWeight: "bold",
              borderRadius: 999,
              textDecoration: "none",
              marginRight: 16,
            }}
          >
            Open ÆInbox
          </a>

          <form action="/api/portal" method="POST" style={{ display: "inline" }}>
            <button
              type="submit"
              style={{
                padding: "16px 42px",
                background: "transparent",
                color: "#00ffa3",
                fontWeight: "bold",
                borderRadius: 999,
                border: "2px solid #00ffa3",
                cursor: "pointer",
              }}
            >
              Manage billing
            </button>
          </form>
        </div>
      )}

      {/* FOOTER */}
      <p style={{ marginTop: 90, opacity: 0.6 }}>
        Powered by Archway Power
      </p>
    </main>
  )
}
