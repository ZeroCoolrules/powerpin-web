"use client"

import { useEffect, useState } from "react"
import { SessionBadge } from "./SessionBadge"
import { CommandPalette } from "./CommandPalette"
import { ProofLog } from "./ProofLog"

// Shape is loose on purpose for v1
type GatewaySession = {
  session_id: string
  trust_class: string
  allowed_commands: string[]
  expires_at: number
}

export default function GatewayAgentPage() {
  const [session, setSession] = useState<GatewaySession | null>(null)
  const [commands, setCommands] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initSession() {
      try {
        // 🔑 Pull JWT from Supabase client session (browser-safe)
        const resSession = await fetch("/api/auth/session")
        const auth = await resSession.json()

        if (!auth?.access_token) {
          setError("Not authenticated")
          return
        }

        // 🔐 Create Gateway session with JWT
        const res = await fetch("/api/gateway/session", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          const msg = await res.text()
          throw new Error(msg)
        }

        const data: GatewaySession = await res.json()

        setSession(data)
        setCommands(
          (data.allowed_commands || []).map((name) => ({
            name,
            description: "",
          }))
        )
      } catch (e: any) {
        console.error(e)
        setError(e.message || "Failed to start gateway session")
      }
    }

    initSession()
  }, [])

  function invoke(name: string) {
    setEvents((e) => [
      ...e,
      { time: Date.now(), action: `requested:${name}` },
    ])
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 font-mono">
        Gateway Error: {error}
      </div>
    )
  }

  if (!session) {
    return (
      <div className="p-6 text-gray-500 font-mono">
        Establishing Gateway session…
      </div>
    )
  }

  return (
    <div className="grid gap-4 p-6">
      <SessionBadge session={session} />
      <CommandPalette commands={commands} onInvoke={invoke} />
      <ProofLog events={events} />
    </div>
  )
}
