import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const host = req.headers.get("host") || ""

  // ✅ Absolute bypass for Supabase auth callback
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next()
  }

  const isInboxDomain =
    host === "inboxae.com" ||
    host === "www.inboxae.com" ||
    host.endsWith(".inboxae.com")

  // 🔒 Block invalid login paths
  if (
    pathname.startsWith("/aeinbox/login") ||
    pathname.startsWith("/inbox/login")
  ) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 🛑 DO NOT redirect root during recovery
  const isRecovery = search.includes("type=recovery")

  if (isInboxDomain && pathname === "/" && !isRecovery) {
    return NextResponse.redirect(new URL("/aeinbox/inbox", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}