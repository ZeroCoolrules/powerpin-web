export const runtime = "nodejs"

import { NextResponse } from "next/server"
import twilio from "twilio"

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()

    if (!phone) {
      return NextResponse.json({ error: "Missing phone" }, { status: 400 })
    }

    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_VERIFY_SERVICE_SID
    ) {
      console.error("Twilio env vars missing")
      return NextResponse.json({ error: "Twilio not configured" }, { status: 500 })
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: "sms",
      })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("2FA send error:", err)
    return NextResponse.json({ error: "2FA failed" }, { status: 500 })
  }
}
