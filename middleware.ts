import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const host = req.headers.get("host") || ""

  const isInboxDomain =
    host.includes("inboxae.com") || host.includes("www.inboxae.com")

  // 🔒 BLOCK INVALID LOGIN PATHS
  if (pathname.includes("/aeinbox/login") || pathname.includes("/inbox/login")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 🔁 FORCE ÆInbox LANDING ON inboxae.com
  if (isInboxDomain && pathname === "/") {
    return NextResponse.redirect(new URL("/aeinbox", req.url))
  }

  // 🔐 PROTECT /inbox (auth gate happens client-side for now)
  if (pathname.startsWith("/inbox")) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}
