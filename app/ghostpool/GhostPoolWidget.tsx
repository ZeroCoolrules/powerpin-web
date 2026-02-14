"use client"

import { useEffect, useState } from "react"

type Item = {
  id: string
  created_at: string
  type: string
  amount: number | null
  currency: string | null
  title: string
  detail: string | null
  visibility: string
}

export default function GhostPoolWidget() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/ghostpool/activity", { method: "GET" })
        const data = await res.json()
        setItems(data.items ?? [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="mt-8 border border-cyan-500/15 rounded-xl p-4 bg-[#0B1220]/60 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-cyan-300">GhostPool</div>
        <div className="text-[11px] text-gray-400">subtle current</div>
      </div>

      {loading ? (
        <div className="text-xs text-gray-400">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-xs text-gray-400">No activity yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="text-xs">
              <div className="flex items-center justify-between">
                <div className="text-gray-200">{i.title}</div>
                <div className="text-gray-500">
                  {i.amount != null ? `${i.amount} ${i.currency ?? ""}` : ""}
                </div>
              </div>
              {i.detail ? (
                <div className="text-gray-400 mt-1 line-clamp-2">{i.detail}</div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
