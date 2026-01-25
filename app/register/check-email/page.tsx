export default function CheckEmailPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#e6eaf0",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>
          Check your email 📬
        </h1>

        <p style={{ opacity: 0.8, maxWidth: 420 }}>
          We sent you a confirmation link.  
          Click it to activate your ÆInbox account.
        </p>

        <p style={{ marginTop: 24, opacity: 0.6 }}>
          You can close this tab after confirming.
        </p>
      </div>
    </div>
  )
}
