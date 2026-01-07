"use client"

import { useEffect, useState } from "react"

type Approval = {
  approval_id: string
  command: string
  requested_at: number
}

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [log, setLog] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/approvals/list")
      .then((r) => r.json())
      .then((d) => setApprovals(d.approvals || []))
  }, [])

  async function resolve(
    approval_id: string,
    decision: "approved" | "rejected"
  ) {
    await fetch("/api/approvals/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approval_id, decision }),
    })

    setLog((l) => [
      ...l,
      `${decision.toUpperCase()}: ${approval_id}`,
    ])

    setApprovals((a) =>
      a.filter((x) => x.approval_id !== approval_id)
    )
  }

  return (
    <div className="p-6 font-mono grid gap-4">
      <h1 className="text-xl text-green-400">Admin Approval Queue</h1>

      {approvals.length === 0 && (
        <div className="text-gray-500">No pending approvals</div>
      )}

      {approvals.map((a) => (
        <div
          key={a.approval_id}
          className="border border-green-700 p-3 rounded grid gap-2"
        >
          <div>ID: {a.approval_id}</div>
          <div>Command: {a.command}</div>
          <div>
            Requested: {new Date(a.requested_at).toLocaleString()}
          </div>

          <div className="flex gap-2">
            <button
              className="px-2 py-1 bg-green-700 rounded"
              onClick={() => resolve(a.approval_id, "approved")}
            >
              Approve
            </button>
            <button
              className="px-2 py-1 bg-red-700 rounded"
              onClick={() => resolve(a.approval_id, "rejected")}
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      <div className="text-xs text-gray-400">
        Audit Log:
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  )
}
