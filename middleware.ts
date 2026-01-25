import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const host = req.headers.get("host")

  if (host === "inboxae.com" || host === "www.inboxae.com") {
    return NextResponse.rewrite(new URL("/aeinbox", req.url))
  }

  return NextResponse.next()
}
