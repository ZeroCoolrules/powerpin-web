"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

export default function InboxPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-400">
        Loading inbox…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 flex font-mono">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-green-800 p-4">
        <div className="flex items-center gap-2 mb-6">
          <img src="/aei.png" alt="AEi" width={64} />
          <span className="text-sm opacity-80">Æi Assistant</span>
        </div>

        <ul className="space-y-2 text-sm">
          <li className="opacity-70">📥 Inbox</li>
          <li className="opacity-40">⭐ Starred</li>
          <li className="opacity-40">🗑 Trash</li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex items-center justify-center opacity-60">
        <div className="text-center">
          <p>No emails yet.</p>
          <p className="text-xs mt-2">Inbox engine coming online.</p>
        </div>
      </main>

      {/* Æi PANEL */}
      <aside className="w-80 border-l border-green-800 p-4">
        <div className="flex items-center gap-3 mb-4">
          <img src="/aei.png" alt="AEi" width={72} />
          <strong>Æi</strong>
        </div>

        <div className="text-sm opacity-70">
          I’ll help summarize threads, flag suspicious emails,
          and draft replies once messages arrive.
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
