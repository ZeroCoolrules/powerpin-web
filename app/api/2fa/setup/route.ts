import { NextRequest, NextResponse } from "next/server"
import speakeasy from "speakeasy"
import QRCode from "qrcode"

export const runtime = "nodejs"

export async function POST() {
  const secret = speakeasy.generateSecret({
    length: 20,
    name: "AEmail",
  })

  const qr = await QRCode.toDataURL(secret.otpauth_url!)

  return NextResponse.json({
    base32: secret.base32,
    qr,
  })
}
