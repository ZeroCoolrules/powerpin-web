import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY missing at runtime")
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      )
    }

    const { text } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: "Missing text" },
        { status: 400 }
      )
    }

    // 👇 IMPORTANT: require inside function
    const OpenAI = (await import("openai")).default

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `Summarize this email into concise bullet points.
Include action items if present.

EMAIL:
${text}`,
    })

    return NextResponse.json({
      summary: response.output_text ?? "",
    })

  } catch (err) {
    console.error("Summarize route error:", err)
    return NextResponse.json(
      { error: "AI failure" },
      { status: 500 }
    )
  }
}
