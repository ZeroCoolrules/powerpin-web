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

  const { prompt } = await req.json()

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Write a clear, professional email draft based on the user's request.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  const draft = completion.choices[0].message.content

  await supabase.from("email_history").insert({
    user_id: session.user.id,
    original_text: prompt,
    ai_draft: draft,
  })

  return NextResponse.json({ draft })
}