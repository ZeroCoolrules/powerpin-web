// app/aeinbox/inbox/InboxClient.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"

type Email = {
  id: string
  sender: string
  subject: string
  body: string
}

export default function InboxClient() {
  const router = useRouter()
  const supabase = supabaseBrowser()

  const [loading, setLoading] = useState(true)
  const [emails, setEmails] = useState<Email[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) return router.push("/login")

      const { data: rows } = await supabase
        .from("emails")
        .select("id, from_name, subject, summary")
        .order("received_at", { ascending: false })

      setEmails(
        rows?.map((e) => ({
          id: e.id,
          sender: e.from_name ?? "Unknown",
          subject: e.subject ?? "",
          body: e.summary ?? "",
        })) ?? []
      )

      setLoading(false)
    }

    load()
  }, [router, supabase])

  if (loading) {
    return <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-8">
      <h1 className="mb-4">Inbox</h1>
      {emails.map((e) => (
        <div key={e.id} className="border border-green-700 p-3 mb-2">
          <strong>{e.sender}</strong>
          <div>{e.subject}</div>
        </div>
      ))}
    </div>
  )
}
