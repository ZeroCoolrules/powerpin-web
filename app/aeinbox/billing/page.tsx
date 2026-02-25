"use client"
import Link from "next/link"
import { useState } from "react"

export default function BillingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function openPortal() {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/portal", {
        method: "POST",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "portal_failed")
      }

      if (!data.url) {
        throw new Error("missing_portal_url")
      }

      window.location.href = data.url
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-cyan-400">Manage Billing</h1>

        <p className="text-gray-400 mt-4">
          Update payment method, cancel subscription, or view invoices.
        </p>

        <button
          onClick={openPortal}
          disabled={loading}
          className="mt-8 w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition"
        >
          {loading ? "Opening…" : "Open Billing Portal"}
        </button>

        {error && (
          <div className="mt-4 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
