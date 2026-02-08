import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const host = req.headers.get("host") || ""

  const isInboxDomain =
    host.includes("inboxae.com") || host.includes("www.inboxae.com")

  /* ─────────────────────────────────────────────
     🔓 ALWAYS ALLOW SUPABASE AUTH CALLBACK
  ───────────────────────────────────────────── */
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next()
  }

  /* ─────────────────────────────────────────────
     🔒 BLOCK INVALID LOGIN PATHS
  ───────────────────────────────────────────── */
  if (
    pathname.includes("/aeinbox/login") ||
    pathname.includes("/inbox/login")
  ) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  /* ─────────────────────────────────────────────
     🔁 FORCE ÆInbox LANDING (ROOT ONLY)
  ───────────────────────────────────────────── */
  if (isInboxDomain && pathname === "/") {
    return NextResponse.redirect(new URL("/aeinbox", req.url))
  }

  /* ─────────────────────────────────────────────
     🔐 PROTECT /inbox (client auth handles gate)
  ───────────────────────────────────────────── */
  if (pathname.startsWith("/inbox")) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}
