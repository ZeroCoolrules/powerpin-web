"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

// TEMP types (replace later)
type Email = {
  id: string
  sender: string
  subject: string
  body: string
}

export default function InboxPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login")
      } else {
        // MOCK inbox for now
        const demoEmails: Email[] = [
          {
            id: "1",
            sender: "Blackstone Recruiting",
            subject: "2026 HR-SIG Summer Analyst",
            body: "Thank you for your interest in Blackstone..."
          },
          {
            id: "2",
            sender: "Æi System",
            subject: "Inbox Initialized",
            body: "Your inbox engine is coming online."
          }
        ]

        setEmails(demoEmails)
        setSelectedEmail(demoEmails[0])
        setLoading(false)
      }
    })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">
        Loading inbox…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 flex font-mono">

      {/* LEFT: EMAIL LIST */}
      <aside className="w-96 border-r border-green-800 p-4">
        <h2 className="text-sm mb-4 opacity-80">Inbox</h2>

        <div className="space-y-2">
          {emails.map(email => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`w-full text-left border p-2 ${
                selectedEmail?.id === email.id
                  ? "border-green-500 bg-green-950"
                  : "border-green-900 hover:border-green-700"
              }`}
            >
              <strong className="block text-sm">{email.sender}</strong>
              <span className="text-xs opacity-70 truncate">
                {email.subject}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* CENTER: EMAIL VIEWER */}
      <main className="flex-1 p-6">
        {selectedEmail ? (
          <>
            <h2 className="text-lg mb-2">{selectedEmail.subject}</h2>
            <p className="text-sm opacity-80">
              From: {selectedEmail.sender}
            </p>

            <div className="mt-4 text-sm leading-relaxed">
              {selectedEmail.body}
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-2">
              <button className="border border-green-700 px-3 py-1">
                Reply
              </button>
              <button className="border border-green-700 px-3 py-1">
                Archive
              </button>
              <button className="border border-green-700 px-3 py-1">
                Delete
              </button>
            </div>

            {/* AI ACTIONS */}
            <div className="mt-6 flex gap-2">
              <button className="border border-green-600 px-3 py-1">
                🧠 Summarize
              </button>
              <button className="border border-green-600 px-3 py-1">
                ✍️ Draft Reply
              </button>
              <button className="border border-green-600 px-3 py-1">
                🛡️ Is This Safe?
              </button>
            </div>
          </>
        ) : (
          <p className="opacity-60">Select an email to view.</p>
        )}
      </main>

      {/* RIGHT: Æi PANEL */}
      <aside className="w-80 border-l border-green-800 p-4">
        <div className="flex items-center gap-3 mb-4">
          <img src="/aei.png" alt="AEi" width={64} />
          <strong>Æi</strong>
        </div>

        <div className="text-sm opacity-70">
          I can summarize threads, detect phishing,
          and draft replies instantly.
        </div>

        <div className="mt-4 border border-green-900 p-3 text-sm">
          <strong>Æi says:</strong>
          <p className="mt-1 opacity-70">
            Select an email to activate AI assistance.
          </p>
        </div>

        <button
          disabled
          className="mt-6 w-full border border-green-700 py-2 opacity-40 cursor-not-allowed"
        >
          Ask Æi (coming soon)
        </button>
      </aside>
    </div>
  )
}
