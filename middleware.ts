import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const host = req.headers.get("host") || ""

  // ✅ Allow auth callback (Supabase redirects here)
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next()
  }

  // ✅ Allow Stripe webhooks + checkout endpoints (extra safety)
  if (pathname.startsWith("/api/stripe")) {
    return NextResponse.next()
  }
  if (pathname === "/api/checkout") {
    return NextResponse.next()
  }

  const isInboxDomain =
    host.includes("inboxae.com") || host.includes("www.inboxae.com")

  // 🔒 Block invalid login paths
  if (pathname.includes("/aeinbox/login") || pathname.includes("/inbox/login")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 🔁 Force ÆInbox landing on inboxae.com root only
  if (isInboxDomain && pathname === "/") {
    return NextResponse.redirect(new URL("/aeinbox", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}
