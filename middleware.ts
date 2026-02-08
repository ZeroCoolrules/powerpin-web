import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const host = req.headers.get("host") || ""

  // ✅ ALLOW SUPABASE AUTH CALLBACK (CRITICAL)
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next()
  }

  const isInboxDomain =
    host.includes("inboxae.com") || host.includes("www.inboxae.com")

  // 🔒 BLOCK INVALID LOGIN PATHS
  if (pathname.includes("/aeinbox/login") || pathname.includes("/inbox/login")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 🔁 FORCE ÆInbox LANDING
  if (isInboxDomain && pathname === "/") {
    return NextResponse.redirect(new URL("/aeinbox", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}
