import { NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Keep Supabase session cookies in sync
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()

  const { pathname } = req.nextUrl
  const host = req.headers.get("host") || ""

  // ✅ allow auth callback paths
  if (pathname.startsWith("/auth/callback")) return res

  const isInboxDomain =
    host.includes("inboxae.com") || host.includes("www.inboxae.com")

  // 🔒 block weird nested login routes
  if (pathname.includes("/aeinbox/login") || pathname.includes("/inbox/login")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 🔁 optional: force landing on inbox domain
  if (isInboxDomain && pathname === "/") {
    return NextResponse.redirect(new URL("/aeinbox", req.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}
