import { NextRequest, NextResponse } from "next/server"
import { supabaseFromJWT } from "@/lib/supabase"
import { getUserFromRequest } from "@/lib/auth"
import { getCommandsForTrust } from "@/lib/commands"

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const trustClass = user.trust_class
  const allowedCommands = getCommandsForTrust(trustClass)

  const sessionId = crypto.randomUUID()

  const { error } = await supabaseFromJWT(req)
    .from("gateway_sessions")
    .insert({
      id: sessionId,
      user_id: user.id,
      trust_class: trustClass,
      allowed_commands: allowedCommands.map(c => c.name),
      expires_at: new Date(Date.now() + 15 * 60 * 1000)
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    gateway_session_id: sessionId,
    expires_in: 900
  })
}
