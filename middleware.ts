import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const host = req.headers.get("host") || ""

  // ✅ ABSOLUTE BYPASS for Supabase auth callback
  // (no redirects, no checks, nothing)
  if (pathname.startsWith("/auth/callback")) {
  return NextResponse.next()
  }


  const isInboxDomain =
    host === "inboxae.com" || host === "www.inboxae.com" || host.endsWith(".inboxae.com")

  // 🔒 BLOCK INVALID LOGIN PATHS
  if (pathname.startsWith("/aeinbox/login") || pathname.startsWith("/inbox/login")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 🔁 FORCE ÆInbox LANDING ON inboxae.com
  if (isInboxDomain && pathname === "/") {
    return NextResponse.redirect(new URL("/aeinbox", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}
