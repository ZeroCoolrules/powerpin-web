"use client"

import { useState } from "react"

export default function EmailViewer({
  message,
  onDelete,
}: {
  message: any
  onDelete: () => void
}) {
  const [aiOutput, setAiOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

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
          onClick={() => setShowDelete(true)}
          className="text-red-400 hover:text-red-500 text-sm"
        >
          Delete
        </button>
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0f172a] border border-red-500/20 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-red-400 mb-4">
              Delete this email?
            </h3>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDelete(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onDelete()
                  setShowDelete(false)
                }}
                className="text-red-400 hover:text-red-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

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