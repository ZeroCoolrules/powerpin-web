import { NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
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