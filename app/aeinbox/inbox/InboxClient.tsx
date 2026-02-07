"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

type Email = {
  id: string
  sender: string
  subject: string
  body: string
}

export default function InboxClient() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const loadInbox = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        router.push("/login")
        return
      }

      const { data: emailRows, error: emailError } = await supabase
        .from("emails")
        .select("id, from_name, subject, summary")
        .order("received_at", { ascending: false })
        .limit(50)

      if (emailError) {
        console.error("Failed to load inbox:", emailError)
        setLoading(false)
        return
      }

      const mappedEmails: Email[] =
        emailRows?.map((e) => ({
          id: e.id,
          sender: e.from_name ?? "Unknown",
          subject: e.subject ?? "(no subject)",
          body: e.summary ?? "",
        })) ?? []

      setEmails(mappedEmails)
      setSelectedEmail(mappedEmails[0] ?? null)
      setLoading(false)
    }

    loadInbox()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">
        Loading inbox…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-8">
      <h1 className="text-lg mb-4">Inbox</h1>

      {emails.length === 0 ? (
        <p className="opacity-60">No messages.</p>
      ) : (
        <ul className="space-y-2">
          {emails.map((email) => (
            <li
              key={email.id}
              className="border border-green-800 p-3 cursor-pointer hover:border-green-600"
              onClick={() => setSelectedEmail(email)}
            >
              <strong>{email.sender}</strong>
              <div className="text-sm opacity-70">
                {email.subject}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
