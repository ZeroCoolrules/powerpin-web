import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: NextRequest) {
  /* ===============================
     1️⃣ Identify caller (session)
  =============================== */
  const supabaseUser = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabaseUser.auth.getSession()

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const user = session.user

  /* ===============================
     2️⃣ Check approver role
     (example: table = reviewers)
  =============================== */
  const { data: reviewer } = await supabaseUser
    .from("store_reviewers")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (!reviewer) {
    return NextResponse.json(
      { error: "Not an approver" },
      { status: 403 }
    )
  }

  /* ===============================
     3️⃣ Parse request
  =============================== */
  const {
    artifact_id,
    decision, // "approved" | "rejected"
    notes,
  } = await req.json()

  if (!artifact_id || !decision) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    )
  }

  /* ===============================
     4️⃣ Admin write (approval log)
  =============================== */
  const supabaseAdmin = getSupabaseAdmin()

  const { error } = await supabaseAdmin
    .from("store_approvals")
    .insert({
      artifact_id,
      status: decision,
      approver_id: user.id,
      approver_role: reviewer.role,
      notes,
    })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    status: "ok",
    artifact_id,
    decision,
  })
}
