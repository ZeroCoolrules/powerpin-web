import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { getUserFromRequest } from "@/lib/auth"
import { isCommandAllowed } from "@/app/system/commands"
import type { TrustClass } from "@/app/system/commands"

export async function POST(req: NextRequest) {
  console.log("🔥 GATEWAY AGENT ROUTE HIT 🔥")

  // ✅ ADMIN CLIENT ONLY
  const supabase = getSupabaseAdmin()

  // ─────────────────────────────────────────────
  // 1️⃣ Authenticate user (cookie/session based)
  // ─────────────────────────────────────────────
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  // ─────────────────────────────────────────────
  // 2️⃣ Parse request body
  // ─────────────────────────────────────────────
  const { input, artifact_id, gateway_session_id } = await req.json()

  if (!input || !artifact_id || !gateway_session_id) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }

  const command = input.trim().toLowerCase().split(/\s+/)[0]

  // ─────────────────────────────────────────────
  // 3️⃣ Load gateway session (ADMIN = no RLS)
  // ─────────────────────────────────────────────
  const { data: session, error } = await supabase
    .from("gateway_sessions")
    .select("*")
    .eq("id", gateway_session_id)
    .single()

  if (error || !session) {
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
  // 4️⃣ DB-level enforcement
  // ─────────────────────────────────────────────
  if (
    trustClass !== "admin" &&
    !session.allowed_commands.includes(command)
  ) {
    await supabase.from("gateway_commands").insert({
      gateway_session_id,
      user_id: user.id,
      artifact_id,
      command,
      accepted: false,
      reason: "not_in_allowed_commands",
    })

    return NextResponse.json(
      { error: "command_not_allowed" },
      { status: 403 }
    )
  }

  // ─────────────────────────────────────────────
  // 5️⃣ Code-level safety
  // ─────────────────────────────────────────────
  if (!isCommandAllowed(trustClass, command)) {
    await supabase.from("gateway_commands").insert({
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
  // 6️⃣ Execute command
  // ─────────────────────────────────────────────
  let message = "Command acknowledged."

  switch (command) {
    case "help":
      message = "Available commands: " + session.allowed_commands.join(", ")
      break
    case "status":
      message = "Gateway online. Session active."
      break
    case "inspect":
      message = `Artifact ${artifact_id} is approved.`
      break
    case "deploy":
      message = "Deploy request recorded."
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
  await supabase.from("gateway_commands").insert({
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
