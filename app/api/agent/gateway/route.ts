import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { getUserFromRequest } from "@/lib/auth"
import { isCommandAllowed } from "@/app/system/commands"
import type { TrustClass } from "@/app/system/commands"

export async function POST(req: NextRequest) {
	
  const supabase = getSupabaseAdmin()
  if (!supabase) {
  return NextResponse.json(
    { error: "Service unavailable" },
    { status: 503 }
  )
}


  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { input, artifact_id, gateway_session_id } = await req.json()
  if (!input || !artifact_id || !gateway_session_id) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }

  const command = input.trim().toLowerCase().split(/\s+/)[0]

  const { data: session, error } = await supabase
    .from("gateway_sessions")
    .select("*")
    .eq("id", gateway_session_id)
    .single()

  if (error || !session) {
    return NextResponse.json({ error: "invalid_gateway_session" }, { status: 403 })
  }

  if (session.user_id !== user.id) {
    return NextResponse.json({ error: "session_user_mismatch" }, { status: 403 })
  }

  const trustClass = session.trust_class as TrustClass

  if (
    trustClass !== "admin" &&
    !session.allowed_commands.includes(command)
  ) {
    return NextResponse.json({ error: "command_not_allowed" }, { status: 403 })
  }

  if (!isCommandAllowed(trustClass, command)) {
    return NextResponse.json({ error: "command_denied" }, { status: 403 })
  }

  await supabase.from("gateway_commands").insert({
    gateway_session_id,
    user_id: user.id,
    artifact_id,
    command,
    accepted: true,
  })

  return NextResponse.json({ ok: true, command })
}
