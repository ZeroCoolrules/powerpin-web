"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function TwoFactorPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function verify() {
    setLoading(true)
    setError("")

    const res = await fetch("/api/2fa/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })

    const data = await res.json()

    if (data.verified) {
      router.replace("/aeinbox/inbox")
    } else {
      setError("Invalid code")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex items-center justify-center">
      <div className="bg-[#111827]/80 border border-cyan-500/20 rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl text-cyan-400 mb-4">
          Two-Factor Authentication
        </h1>

        <input
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 mb-4"
        />

        {error && (
          <div className="text-red-400 text-sm mb-3">{error}</div>
        )}

        <button
          onClick={verify}
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  )
}
