export default function SuccessPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <div>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          🎉 Subscription Active
        </h1>

        <p style={{ opacity: 0.8, marginBottom: "2rem" }}>
          Your ÆInbox subscription is now active.
        </p>

        <a
          href="/aeinbox"
          style={{
            display: "inline-block",
            background: "#34d399",
            color: "#000",
            padding: "14px 28px",
            borderRadius: "10px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Go to ÆInbox
        </a>
      </div>
    </main>
  )
}
