'use client'

export default function GatewayAgent({
  artifactId,
  gatewaySessionId
}: {
  artifactId: string
  gatewaySessionId: string
}) {
  async function sendCommand(input: string) {
    await fetch('/api/agent/gateway', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  },
  body: JSON.stringify({
    input,
    artifact_id: artifactId,
    gateway_session_id: gatewaySessionId
  })
})


  return (
    <div>
      <input
        placeholder="State your intent…"
        onKeyDown={e => {
          if (e.key === 'Enter') sendCommand(e.currentTarget.value)
        }}
      />
    </div>
  )
}
