import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export async function POST(req: NextRequest) {
  const jwt = req.headers
    .get("authorization")
    ?.replace("Bearer ", "")

  if (!jwt) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const supabase = supabaseFromJWT(jwt)
  const supabaseAdmin = getSupabaseAdmin()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json(
      { error: "Invalid user" },
      { status: 401 }
    )
  }

  const {
    artifact_id,
    artifact_hash,
    trust_class,
  } = await req.json()

  await supabaseAdmin.from("approvals").insert({
    artifact_id,
    artifact_hash,
    trust_class,
    approved_by: user.id,
    approved_at: new Date(),
  })

  return NextResponse.json({ ok: true })
}
