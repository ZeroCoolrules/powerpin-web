export function ProofLog({ events }) {
  return (
    <div className="text-xs font-mono border p-2 rounded max-h-48 overflow-y-auto">
      {events.map((e, i) => (
        <div key={i}>
          [{new Date(e.time).toISOString()}] {e.action}
        </div>
      ))}
    </div>
  )
}
