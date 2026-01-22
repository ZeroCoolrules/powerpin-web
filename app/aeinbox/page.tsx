export default function AEinboxPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "auto", padding: "60px 20px" }}>
      <h1 style={{ fontSize: "3rem" }}>ÆInbox</h1>
      <p><strong>Secure Email. Intelligent Assistant. Human-First.</strong></p>

      <p>
        ÆInbox is a private inbox with a built-in AI assistant called <strong>Æi</strong>.
        No ads. No tracking. No data selling.
      </p>

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
          textDecoration: "none"
        }}
      >
        Start with Æi — $10/month
      </a>

      <h2 style={{ marginTop: 60 }}>What ÆInbox Gives You</h2>
      <ul>
        <li>🔐 Privacy-first email</li>
        <li>🤖 Built-in AI assistant (Æi)</li>
        <li>🛡️ Phishing & threat awareness</li>
        <li>🌑 Clean dark-mode interface</li>
      </ul>

      <h2 style={{ marginTop: 60 }}>Meet Æi</h2>
      <p>
        Æi drafts replies, summarizes long threads, and helps you spot suspicious emails —
        so you stay focused, not flooded.
      </p>

      <p style={{ marginTop: 60, opacity: 0.7 }}>
        Powered by PoWERPiN
      </p>
    </main>
  );
}
