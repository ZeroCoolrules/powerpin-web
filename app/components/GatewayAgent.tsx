"use client"

import { useEffect, useState } from "react"

type GatewayAgentProps = {
  artifactId: string
  accessToken: string
}

type AgentMessage = {
  role: "system" | "user" | "agent"
  text: string
}

export default function GatewayAgent({
  artifactId,
  accessToken,
}: GatewayAgentProps) {
  const [gatewaySessionId, setGatewaySessionId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [input, setInput] = useState("")

  // ─────────────────────────────────────────────
  // Initialize gateway session
  // ─────────────────────────────────────────────
  useEffect(() => {
    async function initSession() {
      try {
        setMessages([
          { role: "system", text: "🟡 Initializing session…" },
        ])

        const res = await fetch("/api/gateway/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            artifact_id: artifactId,
          }),
        })

        if (!res.ok) {
          const err = await res.text()
          console.error("Session init failed:", err)
          setMessages([
            { role: "system", text: "❌ Failed to initialize session" },
          ])
          return
        }

        const data = await res.json()

        setGatewaySessionId(data.gateway_session_id)
        setReady(true)

        setMessages([
          { role: "system", text: "🟢 Gateway session established" },
        ])
      } catch (e) {
        console.error(e)
        setMessages([
          { role: "system", text: "❌ Session error" },
        ])
      }
    }

    initSession()
  }, [artifactId, accessToken])

  // ─────────────────────────────────────────────
  // Send command
  // ─────────────────────────────────────────────
  async function sendCommand() {
    if (!input.trim() || !gatewaySessionId) return

    const userMessage = input.trim()
    setInput("")

    setMessages((m) => [
      ...m,
      { role: "user", text: userMessage },
    ])

    const res = await fetch("/api/agent/gateway", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        input: userMessage,
        artifact_id: artifactId,
        gateway_session_id: gatewaySessionId,
      }),
    })

    if (!res.ok) {
      setMessages((m) => [
        ...m,
        { role: "agent", text: "❌ Command rejected" },
      ])
      return
    }

    const data = await res.json()

    setMessages((m) => [
      ...m,
      { role: "agent", text: data.message },
    ])

    // Optional UX: close input on exit
    if (userMessage.toLowerCase() === "exit") {
      setReady(false)
    }
  }

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="border border-green-700 rounded p-4 font-mono text-green-400 bg-black">
      <div className="space-y-2 mb-3 min-h-[120px]">
        {messages.map((m, i) => (
          <div key={i}>
            {m.role === "user" && <span className="text-green-300">› </span>}
            {m.role === "agent" && <span className="text-green-500">◂ </span>}
            {m.role === "system" && <span className="text-yellow-400">• </span>}
            {m.text}
          </div>
        ))}
      </div>

      {ready && (
        <input
          className="w-full bg-black border-t border-green-700 pt-2 outline-none"
          placeholder="State your intent…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendCommand()
            }
          }}
        />
      )}
    </div>
  )
}
