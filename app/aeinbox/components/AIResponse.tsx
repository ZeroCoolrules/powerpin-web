"use client"

import { useState } from "react"

type Props = {
  email: any
}

export default function AIResponse({ email }: Props) {
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  async function summarize() {
    if (!email?.body) return

    setLoading(true)
    setOutput("")

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: email.body }),
      })

      const data = await res.json()
      setOutput(data.summary)
    } catch {
      setOutput("Æi error.")
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return <div className="opacity-50">Select an email</div>
  }

  return (
    <div>
      <h3 className="text-cyan-400 font-semibold mb-4">Æi Intelligence</h3>

      <button
        onClick={summarize}
        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-2 rounded-lg font-semibold transition"
      >
        Summarize
      </button>

      {(loading || output) && (
        <div className="mt-4 border border-cyan-500/20 p-4 rounded-lg text-sm whitespace-pre-wrap">
          {loading ? "Thinking…" : output}
        </div>
      )}
    </div>
  )
}
