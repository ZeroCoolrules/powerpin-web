import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function GET() {
  console.log("SITE URL:", process.env.NEXT_PUBLIC_SITE_URL)

  return NextResponse.json({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  })
}