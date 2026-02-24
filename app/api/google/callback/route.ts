import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 })
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/google/callback`
  )

  const { tokens } = await oauth2Client.getToken(code)

  // TODO: store tokens in database tied to logged-in user
  console.log("Google tokens:", tokens)

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`)
}