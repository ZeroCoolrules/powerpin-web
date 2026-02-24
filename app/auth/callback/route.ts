import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")

  // Create response FIRST
  const res = NextResponse.redirect(new URL("/aeinbox/inbox", req.url))

  if (!code) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const supabase = createRouteHandlerClient({
    cookies,
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL("/login?auth=failed", req.url))
  }

  return res
}