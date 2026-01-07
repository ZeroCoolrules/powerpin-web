import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()

  return NextResponse.json({
    approval_id: body.approval_id,
    decision: body.decision,
    resolved_at: Date.now(),
  })
}
