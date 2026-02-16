"use client"

import { useEffect, useState } from "react"

export default function SignalStatus() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch("/api/network/stats")
      .then(res => res.json())
      .then(setStats)
  }, [])

  if (!stats) return null

  const remaining = stats.next_milestone - stats.active_users
  const progress = (stats.active_users / stats.next_milestone) * 100

  return (
    <div className="mt-12 border border-cyan-500/20 rounded-xl p-6 bg-[#0F172A]/70 backdrop-blur-xl">
      <div className="text-sm text-gray-400 mb-2">
        Live Signal Index
      </div>

      <div className="text-2xl font-semibold text-cyan-400">
        {stats.active_users.toLocaleString()} Active Users
      </div>

      <div className="mt-3 h-2 bg-black rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 text-xs text-gray-500">
        {remaining > 0
          ? `${remaining} until next distribution event`
          : `Milestone reached`}
      </div>
    </div>
  )
}
