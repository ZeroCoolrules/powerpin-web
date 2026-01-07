"use client"

type GatewayAgentProps = {
  artifactId: string
  gatewaySessionId: string
  accessToken: string
}

export default function GatewayAgent({
  artifactId,
  gatewaySessionId,
  accessToken,
}: GatewayAgentProps) {
  async function sendCommand(input: string) {
    if (!input.trim()) return

    // 1️⃣ Send intent to gateway agent API
    await fetch("/api/agent/gateway", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        input,
        artifact_id: artifactId,
        gateway_session_id: gatewaySessionId,
      }),
    })

    // 2️⃣ Register approval request (HITL)
    await fetch("/api/approvals/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approval_id: crypto.randomUUID(),
        command: input,
        artifact_id: artifactId,
        gateway_session_id: gatewaySessionId,
        requested_at: Date.now(),
      }),
    })
  }

  return (
    <div className="border border-green-700 p-3 rounded font-mono">
      <input
        className="w-full bg-black text-green-400 outline-none"
        placeholder="State your intent…"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendCommand(e.currentTarget.value)
            e.currentTarget.value = ""
          }
        }}
      />
    </div>
  )
}
