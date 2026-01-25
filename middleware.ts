import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const host = req.headers.get("host")

  // InboxAE domain → route to ÆInbox
  if (host === "inboxae.com" || host === "www.inboxae.com") {
    return NextResponse.rewrite(
      new URL("/aeinbox", req.url)
    )
  }

  // Default → Powerpin
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
}
