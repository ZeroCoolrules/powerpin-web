import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 })
  }

  // show: user private + public signals
  const { data, error } = await supabase
    .from("ghostpool_activity")
    .select("id, created_at, type, amount, currency, title, detail, visibility")
    .or(`visibility.eq.public,user_id.eq.${session.user.id}`)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: data ?? [] })
}
