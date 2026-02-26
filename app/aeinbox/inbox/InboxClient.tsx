"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"
import Sidebar from "../components/Sidebar"
import EmailList from "../components/EmailList"
import EmailViewer from "../components/EmailViewer"
import ComposeModal from "../components/ComposeModal"

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
  const [showCompose, setShowCompose] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })

    const rows = data ?? []
		setMessages(rows)
		setSelectedId(rows.length ? rows[0].id : null)
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

      <Sidebar>
        <button
          onClick={() => setShowCompose(true)}
          className="mb-4 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg transition"
        >
          Compose
        </button>
      </Sidebar>

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
        <div className="flex items-center justify-center text-gray-500 border border-cyan-500/10 rounded-2xl">
          Select an email
        </div>
      )}

    </div>

    {showCompose && (
      <ComposeModal onClose={() => setShowCompose(false)} />
    )}
  </div>
)

}