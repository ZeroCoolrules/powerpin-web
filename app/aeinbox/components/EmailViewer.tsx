"use client"

import { useState } from "react"

type EmailRow = {
  id: string
  from_name: string | null
  subject: string | null
  summary: string | null
}

export default function EmailViewer({ email }: { email: EmailRow }) {
  const [summary, setSummary] = useState("")
  const [reply, setReply] = useState("")
  const [draft, setDraft] = useState("")
  const [loading, setLoading] = useState(false)

  async function callAPI(endpoint: string, body: any, setter: any) {
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
    <div>
      <div className="border-b border-white/10 pb-4 mb-6">
        <h2 className="text-xl font-semibold">
          {email.subject ?? "(no subject)"}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          From: {email.from_name ?? "Unknown"}
        </p>
      </div>

      <div className="whitespace-pre-wrap text-gray-300 mb-6">
        {email.summary}
      </div>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() =>
            callAPI("/api/ai/summarize", { text: email.summary }, setSummary)
          }
          className="px-4 py-2 bg-cyan-500 text-black rounded"
        >
          Summarize
        </button>

        <button
          onClick={() =>
            callAPI(
              "/api/ai/reply",
              { text: email.summary, tone: "professional" },
              setReply
            )
          }
          className="px-4 py-2 bg-green-500 text-black rounded"
        >
          Generate Reply
        </button>

        <button
          onClick={() =>
            callAPI("/api/ai/compose", { prompt: email.summary }, setDraft)
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
        <ResultBlock title="Summary" color="text-cyan-400" content={summary} />
      )}

      {reply && (
        <ResultBlock title="Suggested Reply" color="text-green-400" content={reply} />
      )}

      {draft && (
        <ResultBlock title="Draft Email" color="text-purple-400" content={draft} />
      )}
    </div>
  )
}

function ResultBlock({
  title,
  color,
  content,
}: {
  title: string
  color: string
  content: string
}) {
  return (
    <div className="mt-8 p-6 bg-[#111827] rounded-xl border border-gray-700">
      <h2 className={`${color} mb-3 text-lg font-semibold`}>
        {title}
      </h2>
      <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
    </div>
  )
}