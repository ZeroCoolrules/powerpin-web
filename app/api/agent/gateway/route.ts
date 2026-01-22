import { NextRequest, NextResponse } from "next/server"
import { supabaseFromJWT, supabaseAdmin } from "@/lib/supabase"
import { getUserFromRequest } from "@/lib/auth"
import { isCommandAllowed, getCommandsForTrust } from "@/app/system/commands"
import type { TrustClass } from "@/app/system/commands"

export async function POST(req: NextRequest) {
  console.log("🔥 GATEWAY AGENT ROUTE HIT 🔥")

  // ─────────────────────────────────────────────
  // 1️⃣ Authenticate user (JWT → user)
  // ─────────────────────────────────────────────
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const authHeader = req.headers.get("authorization")
  if (!authHeader) {
    return NextResponse.json({ error: "missing_auth" }, { status: 401 })
  }

  const jwt = authHeader.replace("Bearer ", "")
  const supabase = supabaseFromJWT(jwt)

  // ─────────────────────────────────────────────
  // 2️⃣ Parse request body
  // ─────────────────────────────────────────────
  const { input, artifact_id, gateway_session_id } = await req.json()

  if (!input || !artifact_id || !gateway_session_id) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }

  const command = input
    .trim()
    .toLowerCase()
    .split(/\s+/)[0]

  console.log("📦 Payload:", {
    command,
    artifact_id,
    gateway_session_id,
  })

  // ─────────────────────────────────────────────
  // 3️⃣ Validate gateway session (RLS enforced)
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

  const trustClass = session.trust_class as TrustClass

  // ─────────────────────────────────────────────
  // 4️⃣ DB-AUTHORITATIVE COMMAND ENFORCEMENT
  // ─────────────────────────────────────────────
  if (
    trustClass !== "admin" &&
    !session.allowed_commands.includes(command)
  ) {
    // 🔒 audit rejection
    await supabaseAdmin.from("gateway_commands").insert({
      gateway_session_id,
      user_id: user.id,
      artifact_id,
      command,
      accepted: false,
      reason: "not_in_allowed_commands",
    })

    return NextResponse.json(
      {
        error: "command_not_allowed",
        command,
        trust_class: trustClass,
        allowed_commands: session.allowed_commands,
      },
      { status: 403 }
    )
  }

  // ─────────────────────────────────────────────
  // 5️⃣ Code-level safety net (defense in depth)
  // ─────────────────────────────────────────────
  if (!isCommandAllowed(trustClass, command)) {
    await supabaseAdmin.from("gateway_commands").insert({
      gateway_session_id,
      user_id: user.id,
      artifact_id,
      command,
      accepted: false,
      reason: "policy_denied",
    })

    return NextResponse.json(
      { error: "command_denied_by_policy" },
      { status: 403 }
    )
  }

  // ─────────────────────────────────────────────
  // 6️⃣ Execute command (controlled switch)
  // ─────────────────────────────────────────────
  let message = "Command acknowledged."

  switch (command) {
    case "help":
      message =
        "Available commands: " +
        session.allowed_commands.join(", ")
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

    case "whoami":
      message = `You are ${trustClass}. User ID: ${user.id}`
      break

    case "exit":
      message = "Gateway session closed."
      break
  }

  // ─────────────────────────────────────────────
  // 7️⃣ Audit ACCEPTED command
  // ─────────────────────────────────────────────
  await supabaseAdmin.from("gateway_commands").insert({
    gateway_session_id,
    user_id: user.id,
    artifact_id,
    command,
    accepted: true,
  })

  // ─────────────────────────────────────────────
  // 8️⃣ Return response
  // ─────────────────────────────────────────────
  return NextResponse.json({
    ok: true,
    message,
    command,
    artifact_id,
    gateway_session_id,
  })
}
