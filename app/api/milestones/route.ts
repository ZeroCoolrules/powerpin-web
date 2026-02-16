import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data } = await supabase
    .from("milestone_events")
    .select("*")
    .order("executed_at", { ascending: false })
    .limit(5)

  return NextResponse.json(data)
}
