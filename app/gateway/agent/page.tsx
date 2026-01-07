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
        // Create browser Supabase client
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Get authenticated session
        const {
          data: { session: authSession },
          error: authError,
        } = await supabase.auth.getSession()

        if (authError || !authSession?.access_token) {
          setError("Not authenticated")
          return
        }

        // Create Gateway session using JWT
        const res = await fetch("/api/gateway/session", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authSession.access_token}`,
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
