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

      // remove query params after showing banner
      if (paid || canceled) {
        const url = new URL(window.location.href)
        url.searchParams.delete("paid")
        url.searchParams.delete("canceled")
        window.history.replaceState({}, "", url.toString())
      }
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
            <div className="text-xs text-gray-500 hidden md:block">
              Gateway active · subtle Ghostpool sync
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Tip: Open any email → hit 🧠 Summarize
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
            <h2 className="text-2xl font-semibold text-cyan-300">Your inbox is empty.</h2>
            <p className="text-gray-400 mt-2">
              This is where daily use starts. When ingest is wired, your mail appears here automatically.
            </p>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-cyan-500/10 bg-black/30 p-4">
                <div className="text-cyan-300 font-semibold">1) Import email</div>
                <div className="text-gray-400 text-sm mt-1">
                  Connect a mailbox (IMAP/OAuth) → we ingest + index.
                </div>
              </div>
              <div className="rounded-xl border border-cyan-500/10 bg-black/30 p-4">
                <div className="text-cyan-300 font-semibold">2) Use Æi daily</div>
                <div className="text-gray-400 text-sm mt-1">
                  Summaries, replies, safety checks. One tap.
                </div>
              </div>
              <div className="rounded-xl border border-cyan-500/10 bg-black/30 p-4">
                <div className="text-cyan-300 font-semibold">3) Ghostpool sync</div>
                <div className="text-gray-400 text-sm mt-1">
                  Every action becomes trust-signal. Subtle now. Loud later.
                </div>
              </div>
            </div>
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
