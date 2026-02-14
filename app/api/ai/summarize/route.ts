export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  try {
    // ─────────────────────────────────────────────
    // ENV VALIDATION
    // ─────────────────────────────────────────────
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

    // ─────────────────────────────────────────────
    // INPUT
    // ─────────────────────────────────────────────
    const { text, emailId, userId } = await req.json()

    if (!text || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // ─────────────────────────────────────────────
    // OPENAI CALL
    // ─────────────────────────────────────────────
    const OpenAI = (await import("openai")).default

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are an email security assistant.

Analyze the following email.

Return STRICT JSON ONLY in this format:

{
  "risk": "red" | "yellow" | "green",
  "summary": "bullet point summary"
}

Risk Rules:
- red = phishing, urgency manipulation, login requests, money requests
- yellow = requires action but not malicious
- green = safe informational

EMAIL:
${text}
      `,
    })

    let parsed
    try {
      parsed = JSON.parse(response.output_text ?? "{}")
    } catch {
      // fallback if model does something weird
      parsed = {
        risk: "green",
        summary: response.output_text ?? "",
      }
    }

    const risk = parsed.risk ?? "green"
    const summary = parsed.summary ?? ""

    // ─────────────────────────────────────────────
    // SUPABASE ADMIN CLIENT
    // ─────────────────────────────────────────────
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )

    // ─────────────────────────────────────────────
    // LOG TO email_ai_actions
    // ─────────────────────────────────────────────
    try {
      await supabaseAdmin.from("email_ai_actions").insert({
        email_id: emailId ?? null,
        user_id: userId,
        action: "summarize",
        input: text,
        output: summary,
        created_at: new Date().toISOString(),
      })
    } catch (e) {
      console.warn("email_ai_actions insert failed:", e)
    }

    // ─────────────────────────────────────────────
    // EMIT ENGINE EVENT
    // ─────────────────────────────────────────────
    try {
      await supabaseAdmin.from("engine_events").insert({
        engine_code: "AEI",
        event_type: "ai_summarize",
        payload: {
          user_id: userId,
          email_id: emailId ?? null,
          risk,
          length: text.length,
        },
        created_at: new Date().toISOString(),
      })
    } catch (e) {
      console.warn("engine_events insert failed:", e)
    }

    // ─────────────────────────────────────────────
    // RETURN JSON
    // ─────────────────────────────────────────────
    return NextResponse.json({
      risk,
      summary,
    })

  } catch (err) {
    console.error("Summarize route error:", err)
    return NextResponse.json(
      { error: "AI failure" },
      { status: 500 }
    )
  }
}
