import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getCommandsForTrust } from "@/lib/commands"

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const trustClass = user.trust_class // observer | user | builder | admin
  const allowedCommands = getCommandsForTrust(trustClass)

  const session = {
    session_id: crypto.randomUUID(),
    principal_id: user.id,
    trust_class: trustClass,
    allowed_commands: allowedCommands.map(c => c.name),
    issued_at: Date.now(),
    expires_at: Date.now() + 15 * 60 * 1000 // 15 min
  }

  return NextResponse.json(session)
}
