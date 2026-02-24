//google connect route//
import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const siteUrl = new URL(req.url).origin

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${siteUrl}/api/google/callback`
  )

  if (!siteUrl) {
    return NextResponse.json({
      error: "SITE_URL_UNDEFINED"
    })
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${siteUrl}/api/google/callback`
  )

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
    prompt: "consent",
  })

  return NextResponse.redirect(authUrl)
}
