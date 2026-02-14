import { NextRequest, NextResponse } from "next/server"
import Twilio from "twilio"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json()

  const client = Twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )

  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: phone,
        code,
      })

    if (check.status === "approved") {
      return NextResponse.json({ verified: true })
    }

    return NextResponse.json({ verified: false }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: "verification_failed" }, { status: 500 })
  }
}
