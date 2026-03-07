import { google } from "googleapis"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get stored Google tokens
    const { data: profile } = await supabase
      .from("profiles")
      .select("google_refresh_token")
      .eq("user_id", session.user.id)
      .single()

    if (!profile?.google_refresh_token) {
      return NextResponse.json(
        { error: "No Gmail connected" },
        { status: 400 }
      )
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )

    oauth2Client.setCredentials({
      refresh_token: profile.google_refresh_token,
    })

    const gmail = google.gmail({ version: "v1", auth: oauth2Client })

    // Pull latest 10 emails
    const list = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    })

    const messages = list.data.messages || []

    for (const msg of messages) {
      const full = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "full",
      })

      const headers = full.data.payload?.headers || []

      const subject =
        headers.find((h) => h.name === "Subject")?.value || "(no subject)"

      const from =
        headers.find((h) => h.name === "From")?.value || "Unknown"

      let body = ""

      if (full.data.payload?.parts) {
        const part = full.data.payload.parts.find(
          (p) => p.mimeType === "text/plain"
        )
        if (part?.body?.data) {
          body = Buffer.from(part.body.data, "base64").toString("utf-8")
        }
      } else if (full.data.payload?.body?.data) {
        body = Buffer.from(
          full.data.payload.body.data,
          "base64"
        ).toString("utf-8")
      }

      // Insert if not already stored
      await supabase.from("messages").upsert(
        {
          id: msg.id,
          user_id: session.user.id,
          from_name: from,
          subject,
          body,
          folder: "inbox",
          is_read: false,
          created_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("GMAIL SYNC ERROR:", err)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}