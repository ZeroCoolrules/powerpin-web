import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()

  return NextResponse.json({
    approval_id: crypto.randomUUID(),
    status: "pending",
    command: body.command,
    requested_at: Date.now(),
  })
}
