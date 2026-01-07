"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

import { SessionBadge } from "./SessionBadge"
import { CommandPalette } from "./CommandPalette"
import { ProofLog } from "./ProofLog"

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
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          setError("Supabase env vars missing")
          return
        }

        const supabase = createClient(supabaseUrl, supabaseKey)
        const {
          data: { session: authSession },
        } = await supabase.auth.getSession()

        if (!authSession?.access_token) {
          setError("Not authenticated")
          return
        }

        const res = await fetch("/api/gateway/session", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authSession.access_token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) throw new Error("Gateway session failed")

        const data: GatewaySession = await res.json()
        setSession(data)
        setCommands(data.allowed_commands.map((name) => ({ name })))
      } catch (e: any) {
        setError(e.message)
      }
    }

    initSession()
  }, [])

  async function invoke(name: string) {
    setEvents((e) => [...e, { time: Date.now(), action: `requested:${name}` }])

    const requiresApproval = ["propose_agent", "run_builder"].includes(name)

    if (requiresApproval) {
      await fetch("/api/approvals/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: name }),
      })

      setEvents((e) => [
        ...e,
        { time: Date.now(), action: `approval:pending:${name}` },
      ])
    }
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 font-mono">Gateway Error: {error}</div>
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
