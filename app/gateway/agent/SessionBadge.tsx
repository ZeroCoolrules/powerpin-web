export function SessionBadge({ session }) {
  return (
    <div className="border p-3 rounded">
      <div><strong>Session</strong></div>
      <div>ID: {session.session_id}</div>
      <div>Trust: {session.trust_class}</div>
      <div>Expires: {new Date(session.expires_at).toLocaleTimeString()}</div>
    </div>
  )
}
