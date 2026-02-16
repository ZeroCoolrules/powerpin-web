"use client"

import { useEffect, useState } from "react"

export default function MilestoneAnnouncement() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/milestones")
      .then(res => res.json())
      .then(setEvents)
  }, [])

  if (!events.length) return null

  const latest = events[0]

  return (
    <div className="mt-12 border border-green-500/30 rounded-xl p-6 bg-[#0F172A]/80 backdrop-blur-xl">
      <div className="text-sm text-green-400 mb-2">
        Distribution Event Executed
      </div>

      <div className="text-xl font-semibold">
        {latest.milestone.toLocaleString()} Users Reached
      </div>

      <div className="text-sm text-gray-400 mt-2">
        Winner ID: {latest.winner_user_id.slice(0, 8)}...
      </div>

      <div className="text-xs text-gray-500 mt-2">
        Snapshot Count: {latest.snapshot_count}
      </div>
    </div>
  )
}
