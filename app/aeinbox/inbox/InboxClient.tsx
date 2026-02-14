"use client"

import { useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import EmailList from "../components/EmailList"
import EmailViewer from "../components/EmailViewer"
import AIResponse from "../components/AIResponse"

export default function InboxClient() {
  const [emails, setEmails] = useState<any[]>([])
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = supabaseBrowser()

    async function loadEmails() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) return

      const { data } = await supabase
        .from("emails")
        .select("*")
        .eq("user_id", session.user.id)
        .order("received_at", { ascending: false })

      setEmails(data || [])
      setSelectedEmail(data?.[0] || null)
      setLoading(false)
    }

    loadEmails()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] text-white flex items-center justify-center">
        Loading…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex">

      {/* LEFT */}
      <div className="w-1/4 border-r border-cyan-500/10">
        <EmailList
          emails={emails}
          onSelect={setSelectedEmail}
        />
      </div>

      {/* CENTER */}
      <div className="flex-1">
        {selectedEmail && (
          <EmailViewer
            subject={selectedEmail.subject}
            sender={selectedEmail.from_name}
            body={selectedEmail.body}
          />
        )}
      </div>

      {/* RIGHT AI PANEL */}
      <div className="w-1/4 border-l border-cyan-500/10 bg-[#0F172A]/60 backdrop-blur-xl p-6">
        <AIResponse email={selectedEmail} />
      </div>

    </div>
  )
}
