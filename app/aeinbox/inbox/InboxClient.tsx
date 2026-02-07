"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function InboxClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [emails, setEmails] = useState<any[]>([])

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login")
        return
      }

      supabaseBrowser
        .from("emails")
        .select("*")
        .order("received_at", { ascending: false })
        .then(({ data }) => {
          setEmails(data ?? [])
          setLoading(false)
        })
    })
  }, [router])

  if (loading) return <div>Loading inbox…</div>

  return (
    <div>
      {emails.map(e => (
        <div key={e.id}>{e.subject}</div>
      ))}
    </div>
  )
}
