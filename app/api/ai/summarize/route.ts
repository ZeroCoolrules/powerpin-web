import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const runtime = "nodejs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "missing_text" }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Summarize this email clearly. Identify urgency, action items, and risk level (low, medium, high).",
        },
        {
          role: "user",
          content: text,
        },
      ],
    })

    const summary = completion.choices[0].message.content

    await supabase.from("email_history").insert({
      user_id: session.user.id,
      original_text: text,
      ai_summary: summary,
    })

    return NextResponse.json({ summary })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}