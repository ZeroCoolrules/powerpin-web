"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"

type Email = {
  id: string
  from_name: string | null
  subject: string | null
  body: string | null
}

export default function InboxClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [emails, setEmails] = useState<Email[]>([])
  const [activeEmail, setActiveEmail] = useState<Email | null>(null)
  const [summary, setSummary] = useState("")
  const [summarizing, setSummarizing] = useState(false)

  useEffect(() => {
    const supabase = supabaseBrowser()

    const load = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/login")
        return
      }

      const { data: rows } = await supabase
        .from("messages")
        .select("id, from_name, subject, body")
        .order("created_at", { ascending: false })

      setEmails(rows ?? [])
      setLoading(false)
    }

    load()
  }, [router])

  async function summarizeEmail() {
    if (!activeEmail?.body) return

    setSummarizing(true)
    setSummary("")

    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: activeEmail.body }),
    })

    const data = await res.json()
    setSummary(data.summary ?? "No summary returned.")
    setSummarizing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] text-cyan-400 flex items-center justify-center">
        Loading…
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#0A0F1E] text-white">

      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-800 p-4 overflow-y-auto">
        <h1 className="text-xl font-semibold text-cyan-400 mb-4">
          Inbox
        </h1>

        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => {
              setActiveEmail(email)
              setSummary("")
            }}
            className="p-3 mb-2 rounded-lg hover:bg-[#111827] cursor-pointer transition"
          >
            <p className="font-semibold">
              {email.subject || "(No subject)"}
            </p>
            <p className="text-xs text-gray-400">
              {email.from_name || "Unknown sender"}
            </p>
          </div>
        ))}
      </div>

      {/* Message View */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeEmail ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              {activeEmail.subject}
            </h2>

            <div className="whitespace-pre-wrap text-gray-300 mb-6">
              {activeEmail.body}
            </div>

            <button
              onClick={summarizeEmail}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg font-semibold transition shadow-lg shadow-cyan-500/20"
            >
              {summarizing ? "Thinking…" : "Summarize with Æi"}
            </button>

            {summary && (
              <div className="mt-6 p-4 bg-[#0B1220] border border-cyan-500/20 rounded-lg">
                <p className="text-cyan-400 font-semibold mb-2">
                  Æi Summary
                </p>
                <p className="whitespace-pre-wrap text-sm">
                  {summary}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500">
            Select a message to view.
          </div>
        )}
      </div>
    </div>
  )
}
