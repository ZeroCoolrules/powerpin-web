"use client"
import { useEffect, useState } from "react"
import { SessionBadge } from "./SessionBadge"
import { CommandPalette } from "./CommandPalette"
import { ProofLog } from "./ProofLog"

export default function GatewayAgentPage() {
  const [session, setSession] = useState(null)
  const [commands, setCommands] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch("/api/gateway/session", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setSession(data)
        setCommands(data.allowed_commands.map(name => ({ name, description: "" })))
      })
  }, [])

  function invoke(name) {
    setEvents(e => [...e, { time: Date.now(), action: `requested:${name}` }])
  }

  if (!session) return null

  return (
    <div className="grid gap-4 p-6">
      <SessionBadge session={session} />
      <CommandPalette commands={commands} onInvoke={invoke} />
      <ProofLog events={events} />
    </div>
  )
}
