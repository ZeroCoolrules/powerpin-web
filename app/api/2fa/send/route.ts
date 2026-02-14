import { NextRequest, NextResponse } from "next/server"
import Twilio from "twilio"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const { phone } = await req.json()

  const client = Twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )

  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: phone,
        channel: "sms",
      })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "failed_to_send_code" }, { status: 500 })
  }
}
