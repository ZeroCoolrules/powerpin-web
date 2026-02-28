import { google } from "googleapis"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

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

    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.redirect(`${origin}/login`)
    }

    await supabase
      .from("profiles")
      .update({
        google_access_token: tokens.access_token ?? null,
        google_refresh_token: tokens.refresh_token ?? null,
        google_token_expiry: tokens.expiry_date ?? null,
      })
      .eq("user_id", session.user.id)

    return NextResponse.redirect(`${origin}/aeinbox/inbox`)
  } catch (err) {
    console.error("GMAIL CALLBACK ERROR:", err)
    return NextResponse.json(
      { error: "OAuth callback failed" },
      { status: 500 }
    )
  }
}