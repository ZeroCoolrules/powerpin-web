import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ✅ STRIP "Bearer "
  const jwt = authHeader.replace("Bearer ", "").trim()

  const supabase = getSupabaseAdmin()

  const { artifact_id, decision } = await req.json()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: "Invalid user" }, { status: 401 })
  }

  await supabase.from("approvals").insert({
    artifact_id,
    requested_by: user.id,
    approved_by: user.id,
    decision,
    decided_at: new Date(),
  })

  await supabase
    .from("artifacts")
    .update({ status: decision })
    .eq("id", artifact_id)

  return NextResponse.json({ ok: true })
}
