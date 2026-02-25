"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function InboxClient() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [summary, setSummary] = useState("")
  const [reply, setReply] = useState("")
  const [draft, setDraft] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    const supabase = supabaseBrowser()
    await supabase.auth.signOut()
    router.push("/login")
  }

  async function callAPI(
    endpoint: string,
    body: any,
    setter: (v: string) => void
  ) {
    setLoading(true)
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    setter(data.summary || data.reply || data.draft || "")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">
      <div className="border-b border-cyan-500/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(0,229,255,0.55)]" />
            <div className="font-semibold tracking-wide">Æmail</div>
          </div>

          <div className="flex gap-6 text-sm">
            <button
              onClick={() => router.push("/aeinbox/billing")}
              className="text-gray-400 hover:text-cyan-400"
            >
              Billing
            </button>

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold text-cyan-400 mb-6">
          AI Email Intelligence
        </h1>

        <textarea
          className="w-full h-48 p-4 bg-black border border-gray-700 rounded-lg"
          placeholder="Paste an email here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-4 mt-4 flex-wrap">
          <button
            onClick={() =>
              callAPI("/api/ai/summarize", { text: input }, setSummary)
            }
            className="px-4 py-2 bg-cyan-500 text-black rounded"
          >
            Summarize
          </button>

          <button
            onClick={() =>
              callAPI(
                "/api/ai/reply",
                { text: input, tone: "professional" },
                setReply
              )
            }
            className="px-4 py-2 bg-green-500 text-black rounded"
          >
            Generate Reply
          </button>

          <button
            onClick={() =>
              callAPI("/api/ai/compose", { prompt: input }, setDraft)
            }
            className="px-4 py-2 bg-purple-500 text-black rounded"
          >
            Compose Draft
          </button>
        </div>

        {loading && (
          <div className="mt-4 text-gray-400">Processing...</div>
        )}

        {summary && (
          <div className="mt-8 p-6 bg-[#111827] rounded-xl border border-gray-700">
            <h2 className="text-cyan-400 mb-3 text-lg font-semibold">
              Summary
            </h2>
            <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
          </div>
        )}

        {reply && (
          <div className="mt-8 p-6 bg-[#111827] rounded-xl border border-gray-700">
            <h2 className="text-green-400 mb-3 text-lg font-semibold">
              Suggested Reply
            </h2>
            <p className="text-gray-300 whitespace-pre-wrap">{reply}</p>
          </div>
        )}

        {draft && (
          <div className="mt-8 p-6 bg-[#111827] rounded-xl border border-gray-700">
            <h2 className="text-purple-400 mb-3 text-lg font-semibold">
              Draft Email
            </h2>
            <p className="text-gray-300 whitespace-pre-wrap">{draft}</p>
          </div>
        )}
      </div>
    </div>
  )
}