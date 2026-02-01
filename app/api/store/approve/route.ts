import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: NextRequest) {
  // ─────────────────────────────────────────────
  // 1️⃣ Extract JWT
  // ─────────────────────────────────────────────
  const authHeader = req.headers.get("authorization")
  const jwt = authHeader?.replace("Bearer ", "")

  if (!jwt) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  // ─────────────────────────────────────────────
  // 2️⃣ Admin client ONLY (server-safe)
  // ─────────────────────────────────────────────
  const supabase = getSupabaseAdmin()

  // ─────────────────────────────────────────────
  // 3️⃣ Validate user from JWT
  // ─────────────────────────────────────────────
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt)

  if (error || !user) {
    return NextResponse.json(
      { error: "Invalid user" },
      { status: 401 }
    )
  }

  // ─────────────────────────────────────────────
  // 4️⃣ Parse body
  // ─────────────────────────────────────────────
  const body = await req.json()

  // TODO: replace with your actual logic
  // Example:
  // await supabase.from("some_table").insert({...})

  // ─────────────────────────────────────────────
  // 5️⃣ Return success
  // ─────────────────────────────────────────────
  return NextResponse.json({
    ok: true,
    user_id: user.id,
  })
}
