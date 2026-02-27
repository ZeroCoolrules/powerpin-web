"use client"

import { useState } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function ComposeModal({
  onClose,
  onSent,
}: {
  onClose: () => void
  onSent: () => void
}) {
  const supabase = supabaseBrowser()

  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)

  async function handleSend() {
    if (!subject && !body) return

    setSending(true)

    const {
		data: { session },
	} 	= await supabase.auth.getSession()

	await supabase.from("messages").insert({
		user_id: session?.user.id,
		from_name: "You",
		subject,
		body,
		folder: "sent",
		is_read: true,
	})

    setSending(false)
    onSent()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0f172a] border border-cyan-500/20 rounded-2xl p-6 w-full max-w-2xl">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-cyan-400 font-semibold">
            Compose
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <input
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full mb-3 px-4 py-2 bg-black border border-gray-700 rounded-lg"
        />

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full mb-3 px-4 py-2 bg-black border border-gray-700 rounded-lg"
        />

        <textarea
          placeholder="Write your message..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full h-40 px-4 py-2 bg-black border border-gray-700 rounded-lg"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>

      </div>
    </div>
  )
}