import { NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// Qpids Place can be served on its own domain from this same app. List its
// hostnames in QPIDS_HOSTS (comma separated, e.g. "qpidsplace.com,www.qpidsplace.com")
// and set NEXT_PUBLIC_QPIDS_ROOT=/ for that deployment. Requests on those
// hosts are rewritten to /qpids/*; every other host keeps PowerPin as it was.
const QPIDS_HOSTS = (process.env.QPIDS_HOSTS || "")
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean)

function qpidsRewrite(req: NextRequest) {
  if (!QPIDS_HOSTS.length) return null
  const host = (req.headers.get("host") || "").split(":")[0].toLowerCase()
  if (!QPIDS_HOSTS.includes(host)) return null
  const url = req.nextUrl.clone()
  if (!url.pathname.startsWith("/qpids")) {
    url.pathname = `/qpids${url.pathname === "/" ? "" : url.pathname}`
  }
  return NextResponse.rewrite(url)
}

export async function middleware(req: NextRequest) {
  const qpids = qpidsRewrite(req)
  if (qpids) return qpids

  const res = NextResponse.next()

  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Allow auth callback always
  if (pathname.startsWith("/auth/callback")) {
    return res
  }

  // If trying to access inbox and not logged in → send to login
  if (pathname.startsWith("/aeinbox") && !session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If logged in and trying to visit login → send to inbox
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/aeinbox/inbox", req.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}