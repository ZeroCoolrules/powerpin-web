import { NextRequest, NextResponse } from "next/server"
import { supabaseFromJWT } from "@/lib/supabase"
import { getUserFromRequest } from "@/lib/auth"
import { isCommandAllowed, getCommandsForTrust } from "@/app/system/commands"

export async function POST(req: NextRequest) {
  console.log("🔥 GATEWAY AGENT ROUTE HIT 🔥")

  // ─────────────────────────────────────────────
  // 1️⃣ Authenticate user (JWT → user)
  // ─────────────────────────────────────────────
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const supabase = supabaseFromJWT(req)

  // ─────────────────────────────────────────────
  // 2️⃣ Parse request body
  // ─────────────────────────────────────────────
  const {
    input,
    artifact_id,
    gateway_session_id
  } = await req.json()

  if (!input || !artifact_id || !gateway_session_id) {
    return NextResponse.json(
      { error: "missing_fields" },
      { status: 400 }
    )
  }

  console.log("📦 Payload:", {
    input,
    artifact_id,
    gateway_session_id
  })

  // ─────────────────────────────────────────────
  // 3️⃣ Validate gateway session
  // ─────────────────────────────────────────────
  const { data: session, error: sessionError } = await supabase
    .from("gateway_sessions")
    .select("*")
    .eq("id", gateway_session_id)
    .single()

  if (sessionError || !session) {
    return NextResponse.json(
      { error: "invalid_gateway_session" },
      { status: 403 }
    )
  }

  if (session.user_id !== user.id) {
    return NextResponse.json(
      { error: "session_user_mismatch" },
      { status: 403 }
    )
  }

  if (session.artifact_id !== artifact_id) {
    return NextResponse.json(
      { error: "session_artifact_mismatch" },
      { status: 403 }
    )
  }

  if (new Date(session.expires_at).getTime() < Date.now()) {
    return NextResponse.json(
      { error: "session_expired" },
      { status: 403 }
    )
  }

  // ─────────────────────────────────────────────
  // 4️⃣ Enforce command policy
  // ─────────────────────────────────────────────
  const command = input.trim().split(" ")[0]
  const trustClass = session.trust_class

  if (!isCommandAllowed(trustClass, command)) {
    return NextResponse.json(
      {
        error: "command_not_allowed",
        command,
        trust_class: trustClass,
        allowed_commands: getCommandsForTrust(trustClass).map(c => c.name)
      },
      { status: 403 }
    )
  }

  // ─────────────────────────────────────────────
  // 5️⃣ Execute command (controlled switch)
  // ─────────────────────────────────────────────
  let message = "Command acknowledged."

  switch (command) {
    case "help":
      message =
        "Available commands: " +
        getCommandsForTrust(trustClass)
          .map(c => c.name)
          .join(", ")
      break

    case "status":
      message = "Gateway online. Session active."
      break

    case "inspect":
      message = `Artifact ${artifact_id} is approved and gateway-enabled.`
      break

    case "deploy":
      message = "Deploy request recorded. Approval required."
      break
  }

  // ─────────────────────────────────────────────
  // 6️⃣ (Optional) Persist event (future-proof)
  // ─────────────────────────────────────────────
  // await supabase.from("gateway_events").insert({
  //   gateway_session_id,
  //   user_id: user.id,
  //   artifact_id,
  //   command,
  //   issued_at: new Date().toISOString()
  // })

  // ─────────────────────────────────────────────
  // 7️⃣ Return response
  // ─────────────────────────────────────────────
  return NextResponse.json({
    ok: true,
    message,
    command,
    artifact_id,
    gateway_session_id
  })
}
