import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { getCommandsForTrust } from "@/app/system/commands"

export async function POST(req: NextRequest) {
  console.log("🔥 GATEWAY SESSION ROUTE HIT 🔥")

  // 1️⃣ Auth
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  // 2️⃣ Parse body
  const { artifact_id } = await req.json()

  if (!artifact_id) {
    return NextResponse.json(
      { error: "missing_fields" },
      { status: 400 }
    )
  }

  // 3️⃣ Resolve trust + commands
  const trustClass = user.trust_class ?? "observer"
  const allowedCommands = getCommandsForTrust(trustClass).map(
    (c) => c.name
  )

  const gateway_session_id = crypto.randomUUID()

  // 4️⃣ Insert (NO issued_at)
  const { error } = await supabaseAdmin
    .from("gateway_sessions")
    .insert({
      id: gateway_session_id,
      artifact_id,
      user_id: user.id,
      trust_class: trustClass,
      allowed_commands: allowedCommands,
      expires_at: new Date(
        Date.now() + 15 * 60 * 1000
      ).toISOString(),
    })

  if (error) {
    console.error("❌ gateway_session insert failed:", error)
    return NextResponse.json(
      { error: "session_create_failed" },
      { status: 500 }
    )
  }

  // 5️⃣ Return session
  return NextResponse.json({
    gateway_session_id,
    trust_class: trustClass,
    allowed_commands: allowedCommands,
  })
}
