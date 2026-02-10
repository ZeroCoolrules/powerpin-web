import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")

  // If user hits the callback without a code, send them to login
  if (!code) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const supabase = createRouteHandlerClient({ cookies })

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    // If exchange fails, go login (you can add logging here)
    return NextResponse.redirect(new URL("/login?auth=failed", req.url))
  }

  // ✅ Session cookie is now set on this response
  return NextResponse.redirect(new URL("/aeinbox/inbox", req.url))
}
