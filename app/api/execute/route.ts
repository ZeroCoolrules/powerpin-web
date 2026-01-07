import { validateCommand } from "@/lib/commands/validate"

export async function POST(req) {
  const { session, command, payload } = await req.json()

  const cmd = validateCommand(session, command)

  if (cmd.requiresApproval) {
    return Response.json({
      status: "pending_approval",
      command
    })
  }

  return Response.json({
    status: "executed",
    command
  })
}
