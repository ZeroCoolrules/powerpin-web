import Link from "next/link"

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

      <footer className="relative z-10 text-center text-xs text-gray-600 pb-10 border-t border-gray-900 pt-8">
        <div className="mb-4">
          <Link href="/privacy" className="mx-3 hover:text-cyan-400 transition">Privacy</Link>
          ·
          <Link href="/terms" className="mx-3 hover:text-cyan-400 transition">Terms</Link>
          ·
          <Link href="/security" className="mx-3 hover:text-cyan-400 transition">Security</Link>
        </div>
        <div>
          © 2026 Æmail · An Archway Power product
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
