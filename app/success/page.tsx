import Image from "next/image"

export default function SuccessPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 640 }}>
        {/* BRAND */}
        <div style={{ marginBottom: 40 }}>
          <Image
            src="/aeinbox-wordmark.png"
            alt="ÆInbox"
            width={300}
            height={70}
            priority
          />
        </div>

        {/* CHECK ICON */}
        <div
          style={{
            width: 96,
            height: 96,
            margin: "0 auto 30px",
            borderRadius: "50%",
            background: "rgba(0,255,163,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px rgba(0,255,163,0.45)",
          }}
        >
          <span style={{ fontSize: 48 }}>✓</span>
        </div>

        {/* MESSAGE */}
        <h1 style={{ fontSize: "2.2rem", fontWeight: 600 }}>
          Subscription confirmed
        </h1>

        <p
          style={{
            marginTop: 16,
            fontSize: "1.15rem",
            opacity: 0.85,
            lineHeight: 1.6,
          }}
        >
          You’re all set. Your ÆInbox subscription is active and ready to go.
        </p>

        {/* CTA */}
        <div style={{ marginTop: 40 }}>
          <a
            href="/aeinbox"
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
            Open ÆInbox
          </a>
        </div>

        {/* SUBTEXT */}
        <p style={{ marginTop: 32, fontSize: 14, opacity: 0.6 }}>
          You can manage billing anytime from your dashboard.
        </p>
      </div>
    </main>
  )
}
