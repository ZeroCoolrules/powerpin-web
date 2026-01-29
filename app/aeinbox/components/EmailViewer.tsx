"use client"

import { useState } from "react"
import { runAI } from "@/hooks/useAI"

type EmailViewerProps = {
  subject: string
  sender: string
  body: string
}

export default function EmailViewer({ subject, sender, body }: EmailViewerProps) {
  const [aiOutput, setAiOutput] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  async function handleAI(mode: "summarize" | "reply" | "safety") {
    try {
      setAiLoading(true)
      setAiOutput("")

      const { result } = await runAI(mode, body)
      setAiOutput(result)
    } catch (err) {
      setAiOutput("Æi encountered an error.")
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="flex-1 p-6">

      {/* SUBJECT */}
      <h2 className="text-lg">{subject}</h2>
      <p className="text-sm opacity-70 mt-1">From: {sender}</p>

      {/* BODY */}
      <div className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">
        {body}
      </div>

      {/* EMAIL ACTIONS */}
      <div className="mt-6 flex gap-2">
        <button className="border px-3 py-1">Reply</button>
        <button className="border px-3 py-1">Archive</button>
        <button className="border px-3 py-1">Delete</button>
      </div>

      {/* AI ACTIONS */}
      <div className="mt-6 flex gap-2">
        <button onClick={() => handleAI("summarize")} className="border px-3 py-1">
          🧠 Summarize
        </button>
        <button onClick={() => handleAI("reply")} className="border px-3 py-1">
          ✍️ Draft Reply
        </button>
        <button onClick={() => handleAI("safety")} className="border px-3 py-1">
          🛡️ Is This Safe?
        </button>
      </div>

      {/* AI OUTPUT */}
      {(aiLoading || aiOutput) && (
        <div className="mt-6 border p-4">
          <strong>Æi:</strong>
          <pre className="mt-2 text-sm whitespace-pre-wrap">
            {aiLoading ? "Thinking…" : aiOutput}
          </pre>
        </div>
      )}
    </div>
  )
}
