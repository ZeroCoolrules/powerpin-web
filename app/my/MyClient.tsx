'use client'

export default function MyClient({
  trustEvents,
  growFlows,
}: {
  trustEvents: any[]
  growFlows: any[]
}) {
  return (
    <div style={{ color: '#00ff99', background: 'black', padding: 20 }}>
      <h1>My Trust & GROW</h1>

      <h2>Trust Events</h2>
      <pre>{JSON.stringify(trustEvents, null, 2)}</pre>

      <h2>GROW Flows</h2>
      <pre>{JSON.stringify(growFlows, null, 2)}</pre>
    </div>
  )
}
