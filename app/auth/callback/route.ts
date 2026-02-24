import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/aeinbox/inbox", req.url))

  const supabase = createRouteHandlerClient({ cookies })

  const code = req.nextUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("OAuth exchange error:", error)
    return NextResponse.redirect(new URL("/login?auth=failed", req.url))
  }

  return res
}