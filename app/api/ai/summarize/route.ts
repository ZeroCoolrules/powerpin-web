import OpenAI from "openai"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== "string" || text.trim().length < 10) {
      return NextResponse.json({ error: "missing_text" }, { status: 400 })
    }

    const prompt = `Summarize the email thread below into 3-6 bullet points.
- Keep it crisp.
- Include action items and deadlines if present.
- If no action items, say "No action items found."

EMAIL:
${text}`

    // Using the official SDK (Responses is recommended in OpenAI docs for new projects)
    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    })

    const summary = resp.output_text?.trim() || ""

    return NextResponse.json({ summary })
  } catch (e: any) {
    console.error("summarize_error", e)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
