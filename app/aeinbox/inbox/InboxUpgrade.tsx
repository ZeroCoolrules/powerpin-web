"use client"

import { useState } from "react"

export default function InboxUpgrade() {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function start() {
    try {
      setLoading(true)
      setErr(null)
      const res = await fetch("/api/checkout", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "checkout_failed")
      if (!data?.url) throw new Error("missing_checkout_url")
      window.location.href = data.url
    } catch (e: any) {
      setErr(e?.message || "Checkout failed")
      setLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse" />

      <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,229,255,0.15)] text-center">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-2">
          Upgrade to AEmail
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Secure, AI-powered email with privacy-first design.
        </p>

        <button
          onClick={start}
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black font-semibold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20"
        >
          {loading ? "Opening secure checkout…" : "Start with Æi — $10/month"}
        </button>

        <div className="mt-4 text-xs text-cyan-300/70">
          Secure checkout · Cancel anytime
        </div>

        {err && <div className="mt-3 text-xs text-red-400">{err}</div>}
      </div>
    </div>
  )
}
