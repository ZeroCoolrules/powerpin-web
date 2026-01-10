"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function GatewayAgent({
  artifactId
}: {
  artifactId: string
}) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [log, setLog] = useState<string[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    async function initSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLog(l => [...l, "❌ Not authenticated"])
        return
      }

      const res = await fetch("/api/gateway/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        }
      })

      const data = await res.json()
      setSessionId(data.gateway_session_id)
      setLog(l => [...l, "✅ Gateway session established"])
    }

    initSession()
  }, [artifactId])

  async function send() {
    if (!sessionId || !input.trim()) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const res = await fetch("/api/agent/gateway", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        input,
        artifact_id: artifactId,
        gateway_session_id: sessionId
      })
    })

    const data = await res.json()
    setLog(l => [...l, JSON.stringify(data)])
    setInput("")
  }

  return (
    <div className="border border-green-700 p-4 font-mono">
      <div className="mb-2 text-green-400">
        {sessionId ? "🟢 Session active" : "🟡 Initializing session…"}
      </div>

      <input
        className="w-full bg-black text-green-400 p-2 outline-none"
        placeholder="State your intent…"
        disabled={!sessionId}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && send()}
      />

      <ul className="mt-3 text-xs text-green-300 space-y-1">
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  )
}
