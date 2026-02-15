"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"
import EmailList from "../components/EmailList"
import EmailViewer from "../components/EmailViewer"

type EmailRow = {
  id: string
  from_name: string | null
  subject: string | null
  summary: string | null
}

export default function InboxClient() {
  const router = useRouter()
  const params = useSearchParams()
  const paid = params.get("paid")
  const canceled = params.get("canceled")

  const [loading, setLoading] = useState(true)
  const [emails, setEmails] = useState<EmailRow[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  const selected = useMemo(() => {
    const e = emails.find((x) => x.id === selectedId) || emails[0]
    return e || null
  }, [emails, selectedId])

  async function handleLogout() {
    const supabase = supabaseBrowser()
    await supabase.auth.signOut()
    router.push("/login")
  }

  useEffect(() => {
    const supabase = supabaseBrowser()

    const load = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) return router.push("/login")

      if (paid) setBanner("Payment confirmed. Welcome to AEmail.")
      if (canceled) setBanner("Checkout canceled. You can start again anytime.")

      const { data: rows } = await supabase
        .from("emails")
        .select("id, from_name, subject, summary")
        .order("received_at", { ascending: false })
        .limit(50)

      setEmails((rows as EmailRow[]) || [])
      setSelectedId((rows as EmailRow[])?.[0]?.id || null)
      setLoading(false)
    }

    load()
  }, [router, paid, canceled])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] text-white flex items-center justify-center">
        Loading…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">
      <div className="sticky top-0 z-10 border-b border-cyan-500/10 bg-[#0A0F1E]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(0,229,255,0.55)]" />
            <div className="font-semibold tracking-wide">AEmail</div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => router.push("/aeinbox/billing"))}
              className="text-gray-400 hover:text-cyan-400 transition"
            >
              Billing
            </button>

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {banner && (
          <div className="max-w-6xl mx-auto px-4 pb-4">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
              {banner}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {emails.length === 0 ? (
          <div className="rounded-2xl border border-cyan-500/15 bg-[#0f172a]/60 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-semibold text-cyan-300">
              Your inbox is empty.
            </h2>
            <p className="text-gray-400 mt-2">
              Connect your email to start using Æi daily.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-[360px_1fr] gap-6">
            <EmailList
              emails={emails.map((e) => ({
                id: e.id,
                sender: e.from_name ?? "Unknown",
                subject: e.subject ?? "(no subject)",
                preview: (e.summary ?? "").slice(0, 90),
              }))}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />

            {selected && (
              <EmailViewer
                emailId={selected.id}
                subject={selected.subject ?? "(no subject)"}
                sender={selected.from_name ?? "Unknown"}
                body={selected.summary ?? ""}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
