// components/AeiFloatingButton.tsx

"use client"

import { useState } from "react"

type Props = {
  getSelectedText: () => string
  userId: string
  emailId?: string | null
}

export default function AeiFloatingButton({
  getSelectedText,
  userId,
  emailId,
}: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [risk, setRisk] = useState<"red" | "yellow" | "green" | null>(null)
  const [summary, setSummary] = useState<string>("")

  async function runAI() {
    const text = getSelectedText()
    if (!text) return

    setLoading(true)
    setOpen(true)

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          userId,
          emailId: emailId ?? null,
        }),
      })

      const data = await res.json()

      setRisk(data.risk ?? "green")
      setSummary(data.summary ?? "")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const glowColor =
    risk === "red"
      ? "rgba(255,0,0,0.7)"
      : risk === "yellow"
      ? "rgba(255,200,0,0.7)"
      : "rgba(0,255,153,0.7)"

  return (
    <>
      <button
        onClick={runAI}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#00ff99",
          color: "#000",
          fontWeight: 700,
          fontSize: 18,
          boxShadow: `0 0 20px ${glowColor}`,
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        Æi
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: 320,
            background: "#0a0f1c",
            border: "1px solid #1f2a44",
            borderRadius: 12,
            padding: 16,
            color: "#fff",
            zIndex: 9999,
            boxShadow: "0 0 30px rgba(0,0,0,0.5)",
          }}
        >
          {loading ? (
            <div>Analyzing...</div>
          ) : (
            <>
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: 8,
                  color:
                    risk === "red"
                      ? "#ff4d4f"
                      : risk === "yellow"
                      ? "#ffc107"
                      : "#00ff99",
                }}
              >
                Risk: {risk?.toUpperCase()}
              </div>

              <div
                style={{
                  fontSize: 14,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                }}
              >
                {summary}
              </div>

              <button
                onClick={() => setOpen(false)}
                style={{
                  marginTop: 12,
                  background: "#111827",
                  color: "#fff",
                  border: "1px solid #1f2937",
                  borderRadius: 8,
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}