"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"
import Sidebar from "../components/Sidebar"
import EmailList from "../components/EmailList"
import EmailViewer from "../components/EmailViewer"

type Message = {
  id: string
  from_name: string | null
  subject: string | null
  body: string | null
  created_at: string
  folder: string | null
}

export default function InboxClient() {
  const router = useRouter()
  const supabase = supabaseBrowser()

  const [messages, setMessages] = useState<Message[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })

    setMessages(data || [])
    setSelectedId(data?.[0]?.id || null)
    setLoading(false)
  }

  useEffect(() => {
    loadMessages()
  }, [])

  async function handleDelete(id: string) {
    await supabase.from("messages").delete().eq("id", id)
    loadMessages()
  }

  const selected = messages.find((m) => m.id === selectedId)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] text-white flex items-center justify-center">
        Loading…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">

      <div className="grid grid-cols-[220px_380px_1fr] gap-6 max-w-7xl mx-auto px-6 py-6">

        <Sidebar />

        <EmailList
          emails={messages.map((m) => ({
            id: m.id,
            sender: m.from_name ?? "Unknown",
            subject: m.subject ?? "(no subject)",
            preview: (m.body ?? "").slice(0, 80),
          }))}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        {selected ? (
          <EmailViewer
            message={selected}
            onDelete={() => handleDelete(selected.id)}
          />
        ) : (
          <div>Select a message</div>
        )}

      </div>
    </div>
  )
}