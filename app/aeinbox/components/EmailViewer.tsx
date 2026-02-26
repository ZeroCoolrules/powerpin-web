"use client"

import { useState } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function EmailViewer({
  message,
  onDelete,
}: {
  message: any
  onDelete: () => void
}) {
  const supabase = supabaseBrowser()

  const [aiOutput, setAiOutput] = useState("")
  const [loading, setLoading] = useState(false)

  async function runAI(type: string) {
    setLoading(true)

    const res = await fetch(`/api/ai/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message.body }),
    })

    const data = await res.json()

    const output =
      data.summary || data.reply || data.draft || "No response"

    setAiOutput(output)

    await supabase.from("email_history").insert({
      original_text: message.body,
      ai_summary: type === "summarize" ? output : null,
      ai_reply: type === "reply" ? output : null,
      ai_draft: type === "compose" ? output : null,
    })

    setLoading(false)
  }

  return (
    <div className="bg-[#0f172a] rounded-2xl p-6 border border-cyan-500/10">

      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            {message.subject}
          </h2>
          <div className="text-sm text-gray-400">
            From: {message.from_name}
          </div>
        </div>

        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Delete
        </button>
      </div>

      <div className="whitespace-pre-wrap text-gray-300 mb-6">
        {message.body}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => runAI("summarize")}
          className="px-4 py-2 bg-cyan-500 text-black rounded"
        >
          Summarize
        </button>

        <button
          onClick={() => runAI("reply")}
          className="px-4 py-2 bg-green-500 text-black rounded"
        >
          Reply
        </button>

        <button
          onClick={() => runAI("compose")}
          className="px-4 py-2 bg-purple-500 text-black rounded"
        >
          Compose
        </button>
      </div>

      {loading && (
        <div className="mt-4 text-gray-400">Processing…</div>
      )}

      {aiOutput && (
        <div className="mt-6 p-4 bg-[#111827] rounded-xl border border-gray-700">
          {aiOutput}
        </div>
      )}
    </div>
  )
}