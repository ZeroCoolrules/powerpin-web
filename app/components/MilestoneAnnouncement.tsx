"use client"

import { useEffect, useState } from "react"

type NetworkStats = {
  active_users: number
  next_milestone: number
  current_milestone: number | null
  last_milestone: number | null
}

export default function MilestoneAnnouncement() {
  const [stats, setStats] = useState<NetworkStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/network")
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch network stats", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return null
  if (!stats) return null

  const progress =
    (stats.active_users / stats.next_milestone) * 100

  return (
    <div className="w-full bg-black border-y border-cyan-500/20 py-6 text-center">
      <h2 className="text-lg text-cyan-400 font-semibold">
        Network Autonomy Counter
      </h2>

      <p className="text-3xl font-bold text-white mt-2">
        {stats.active_users.toLocaleString()} users
      </p>

      <p className="text-sm text-gray-400 mt-1">
        Next draw at {stats.next_milestone.toLocaleString()}
      </p>

      <div className="max-w-xl mx-auto mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
