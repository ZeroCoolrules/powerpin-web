export default function AEinboxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        backgroundColor: "#0b0f14",
        color: "#e6eaf0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <main style={{ flex: 1 }}>
        {children}
      </main>

      <footer
        style={{
          marginTop: 80,
          padding: "40px 20px",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#7d8696",
          borderTop: "1px solid #1f2937",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <a href="/privacy" style={linkStyle}>
            Privacy
          </a>
          ·
          <a href="/terms" style={linkStyle}>
            Terms
          </a>
          ·
          <a href="/security" style={linkStyle}>
            Security
          </a>
        </div>

        <div>
          © {new Date().getFullYear()} ÆInbox · An Archway Power product
        </div>
      </footer>
    </div>
  )
}

const linkStyle: React.CSSProperties = {
  margin: "0 10px",
  color: "#9ca3af",
  textDecoration: "none",
}
