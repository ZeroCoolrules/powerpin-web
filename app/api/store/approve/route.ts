import { NextRequest, NextResponse } from "next/server"
import { supabaseFromJWT, getSupabaseAdmin } from "@/lib/supabase-server"
import { canApprove } from "@/lib/permissions"

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const jwt = authHeader.replace("Bearer ", "")

  const supabase = supabaseFromJWT(jwt)
  const supabaseAdmin = getSupabaseAdmin()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json(
      { error: "Invalid user" },
      { status: 401 }
    )
  }

  if (!(await canApprove(user.id))) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    )
  }

  const { artifact_id, decision } = await req.json()

  await supabaseAdmin.from("approvals").insert({
    artifact_id,
    requested_by: user.id,
    approved_by: user.id,
    decision,
    decided_at: new Date(),
  })

  await supabaseAdmin
    .from("artifacts")
    .update({ status: decision })
    .eq("id", artifact_id)

  return NextResponse.json({ ok: true })
}
