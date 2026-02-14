import { NextRequest, NextResponse } from "next/server"
import speakeasy from "speakeasy"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const { token, secret } = await req.json()

  const verified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  })

  if (!verified) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 })
  }

  // Save to Supabase (encrypt secret in production)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // You'll attach to logged-in user here

  return NextResponse.json({ success: true })
}
