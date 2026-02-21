export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  try {

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      )
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "Missing Supabase credentials" },
        { status: 500 }
      )
    }

    const { powType, pinType, offer, consideration, duration, userId } =
      await req.json()

    if (!powType || !pinType || !offer || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const OpenAI = (await import("openai")).default

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are the PoWERPiN strategic intelligence system.

Analyze this POW to PIN proposal.

Return STRICT JSON ONLY:

{
  "impactScore": number (0-100),
  "riskLevel": "low" | "moderate" | "high",
  "advisory": "concise structured guidance"
}

POW Type: ${powType}
PIN Type: ${pinType}
Offer: ${offer}
Consideration: ${consideration ?? 0}
Duration (months): ${duration ?? 0}
      `,
    })

    let parsed
    try {
      parsed = JSON.parse(response.output_text ?? "{}")
    } catch {
      parsed = {
        impactScore: 50,
        riskLevel: "moderate",
        advisory: response.output_text ?? "",
      }
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )

    await supabaseAdmin.from("engine_events").insert({
      engine_code: "PPN",
      event_type: "contract_analysis",
      payload: {
        user_id: userId,
        powType,
        pinType,
        impactScore: parsed.impactScore,
        riskLevel: parsed.riskLevel,
      },
      created_at: new Date().toISOString(),
    })

    return NextResponse.json(parsed)

  } catch (err) {
    console.error("PoWERPiN route error:", err)
    return NextResponse.json(
      { error: "AI failure" },
      { status: 500 }
    )
  }
}