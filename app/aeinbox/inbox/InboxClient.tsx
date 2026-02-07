"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
    const loadInbox = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
        return
      }

      const { data: emailRows, error } = await supabase
        .from("emails")
        .select("id, from_name, subject, summary")
        .order("received_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      const mappedEmails =
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

  // UI stays exactly as you wrote it
  return (/* unchanged UI */)
}
