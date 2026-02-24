"use client"

import { useState } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function ForgotPassword() {
  const supabase = supabaseBrowser()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  async function handleReset() {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://www.inboxae.com/login",
    })
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E] text-white">
      <div className="bg-[#0F172A] p-8 rounded-xl border border-cyan-500/20">
        <h2 className="text-xl mb-4">Reset Password</h2>

        {sent ? (
          <p className="text-green-400 text-sm">
            Check your email for reset instructions.
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700"
            />
            <button
              onClick={handleReset}
              className="w-full mt-4 py-3 rounded-xl bg-cyan-500 text-black"
            >
              Send reset link
            </button>
          </>
        )}
      </div>
    </div>
  )
}