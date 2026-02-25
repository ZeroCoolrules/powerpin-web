import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const runtime = "nodejs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { text, tone } = await req.json()

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Generate a professional email reply. Tone: ${tone || "professional"}.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  })

  const reply = completion.choices[0].message.content

  await supabase.from("email_history").insert({
    user_id: session.user.id,
    original_text: text,
    ai_reply: reply,
  })

  return NextResponse.json({ reply })
}