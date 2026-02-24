import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function GET() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  oauth2Client.setCredentials({
    access_token: "TEMP_ACCESS_TOKEN",
    refresh_token: "TEMP_REFRESH_TOKEN",
  })

  const gmail = google.gmail({ version: "v1", auth: oauth2Client })

  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
  })

  return NextResponse.json(response.data)
}