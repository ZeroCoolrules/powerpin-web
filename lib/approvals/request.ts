export function requestApproval(command, session) {
  return {
    approval_id: crypto.randomUUID(),
    status: "awaiting_human"
  }
}
