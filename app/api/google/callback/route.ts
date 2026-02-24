import { google } from "googleapis"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const code = url.searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    const origin = url.origin

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${origin}/api/google/callback`
    )

    const { tokens } = await oauth2Client.getToken(code)

    // 🔥 For now just log them
    console.log("GMAIL TOKENS:", tokens)

    // TODO: Save tokens to DB tied to logged-in user

    return NextResponse.redirect(`${origin}/aeinbox/inbox`)
  } catch (err) {
    console.error("GMAIL CALLBACK ERROR:", err)
    return NextResponse.json(
      { error: "OAuth callback failed" },
      { status: 500 }
    )
  }
}