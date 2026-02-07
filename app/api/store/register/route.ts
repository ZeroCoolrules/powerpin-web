import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: NextRequest) {
  // 1️⃣ Identify caller (SESSION-AWARE)
  const supabaseUser = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabaseUser.auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = session.user

  // 2️⃣ Admin client (writes only)
  const supabaseAdmin = getSupabaseAdmin()

  const {
    artifact_id,
    artifact_hash,
    trust_class,
    manifest_summary,
  } = await req.json()

  if (!artifact_id || !artifact_hash || !trust_class) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  const { error } = await supabaseAdmin
    .from("store_artifacts")
    .insert({
      artifact_id,
      artifact_hash,
      trust_class,
      builder_id: user.id,
      status: "pending",
      manifest_summary,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ status: "registered", artifact_id })
}
