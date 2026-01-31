import { NextRequest, NextResponse } from "next/server"
import { supabaseFromJWT } from "@/lib/supabase-server"


export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization")
  const supabase = supabaseFromJWT(auth!)

  const { artifact_id, decision } = await req.json()

  const user = (await supabase.auth.getUser()).data.user

  await supabase.from("approvals").insert({
    artifact_id,
    requested_by: user?.id,
    approved_by: user?.id,
    decision,
    decided_at: new Date()
  })

  await supabase.from("artifacts")
    .update({ status: decision })
    .eq("id", artifact_id)

  return NextResponse.json({ ok: true })
}
