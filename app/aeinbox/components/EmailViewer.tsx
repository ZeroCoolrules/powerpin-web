"use client"

import { useState } from "react"
import { useAI } from "@/app/hooks/useAI"
import AIResponse from "./AIResponse"

type EmailViewerProps = {
  emailId: string
  subject: string
  sender: string
  body: string
}

export default function EmailViewer({ emailId, subject, sender, body }: EmailViewerProps) {
  const [aiOutput, setAiOutput] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  async function handleAI(mode: "summarize" | "reply" | "safety") {
    try {
      setAiLoading(true)
      setAiOutput("")
      const { result } = await runAI(mode, body, emailId)
      setAiOutput(result)
    } catch {
      setAiOutput("Æi encountered an error.")
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-cyan-500/15 bg-[#0f172a]/60 backdrop-blur-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">{subject}</h2>
          <p className="text-sm text-gray-400 mt-1">From: {sender}</p>
        </div>

        <div className="text-xs text-gray-500">
          trust-signal: <span className="text-cyan-300">armed</span>
        </div>
      </div>

      <div className="mt-5 text-sm leading-relaxed whitespace-pre-wrap text-gray-200">
        {body}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleAI("summarize")}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition"
        >
          🧠 Summarize
        </button>
        <button
          onClick={() => handleAI("reply")}
          className="px-4 py-2 rounded-xl border border-cyan-500/20 text-cyan-100 hover:bg-cyan-500/10 transition"
        >
          ✍️ Draft Reply
        </button>
        <button
          onClick={() => handleAI("safety")}
          className="px-4 py-2 rounded-xl border border-cyan-500/20 text-cyan-100 hover:bg-cyan-500/10 transition"
        >
          🛡️ Is This Safe?
        </button>
      </div>

      {(aiLoading || aiOutput) && (
        <AIResponse loading={aiLoading} output={aiOutput} />
      )}
    </div>
  )
}
