import { NextResponse } from "next/server"
import OpenAI from "openai"

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { mode, content } = await req.json()

  let prompt = ""
  if (mode === "summarize")
    prompt = "Summarize this email in 5 bullet points with actions:\n\n" + content
  if (mode === "reply")
    prompt = "Draft a clear, polite reply to this email:\n\n" + content
  if (mode === "safety")
    prompt =
      "Analyze this email for phishing or malicious intent. Respond with Risk Level (Low/Medium/High), Reason, and Recommended Action:\n\n" +
      content

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are ÆInbox AI. Privacy-first. Concise. Helpful." },
      { role: "user", content: prompt },
    ],
  })

  return NextResponse.json({
    result: completion.choices[0].message.content,
  })
}
