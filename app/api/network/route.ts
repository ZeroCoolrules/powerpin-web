import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from("network_stats")
      .select("*")
      .single()

    if (error) {
      return NextResponse.json({ error: "network_fetch_failed" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error("Network API error:", err)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
