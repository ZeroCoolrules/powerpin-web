import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(req: Request) {
  // 🔐 Guard: prevent build/runtime crashes
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    )
  }

  const { mode, content } = await req.json()

  if (!mode || !content) {
    return NextResponse.json(
      { error: "Missing mode or content" },
      { status: 400 }
    )
  }

  // ✅ Instantiate ONLY at runtime (build-safe)
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  let prompt = ""

  switch (mode) {
    case "summarize":
      prompt =
        "Summarize this email in 5 bullet points with clear next actions:\n\n" +
        content
      break

    case "reply":
      prompt =
        "Draft a clear, polite, and professional reply to this email:\n\n" +
        content
      break

    case "safety":
      prompt =
        "Analyze this email for phishing or malicious intent. Respond with:\n" +
        "• Risk Level (Low / Medium / High)\n" +
        "• Reason\n" +
        "• Recommended Action\n\n" +
        content
      break

    default:
      return NextResponse.json(
        { error: "Invalid AI mode" },
        { status: 400 }
      )
  }

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are ÆInbox AI. Privacy-first. Concise. Helpful.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  return NextResponse.json({
    result: completion.choices[0].message.content,
  })
}
