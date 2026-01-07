import { NextResponse } from "next/server"

let approvals: any[] = []

export async function GET() {
  return NextResponse.json({
    approvals,
  })
}

export async function POST(req: Request) {
  const body = await req.json()
  approvals.push(body)

  return NextResponse.json({ status: "stored" })
}
