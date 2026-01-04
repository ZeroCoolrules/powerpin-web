// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/store/approve")) {
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json(
        { error: "Authorization required" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/store/approve/:path*"]
};
