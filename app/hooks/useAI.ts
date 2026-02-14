import { supabaseBrowser } from "@/lib/supabase-browser"

type Mode = "summarize" | "reply" | "safety"

export async function runAI(mode: Mode, text: string, emailId?: string) {
  const supabase = supabaseBrowser()

  const promptMode =
    mode === "summarize"
      ? "summarize"
      : mode === "reply"
      ? "reply"
      : "safety"

  // AI call (start with summarize route)
  let result = ""
  if (promptMode === "summarize") {
    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || "ai_failed")
    result = data.summary || ""
  } else if (promptMode === "reply") {
    result =
      "Draft Reply (stub):\n\nThanks — I’ll take a look and get back to you shortly.\n\n— Sent from AEmail"
  } else {
    result =
      "Safety Check (stub):\n\nNo obvious phishing signals detected in this content.\n(We’ll wire real scoring next.)"
  }

  // Log action (best-effort; won’t break if table policy blocks)
  try {
    const { data: sess } = await supabase.auth.getSession()
    const userId = sess.session?.user?.id

    if (userId) {
      await supabase.from("email_ai_actions").insert({
        user_id: userId,
        email_id: emailId || null,
        action: promptMode,
        input_text: text,
        output_text: result,
        created_at: new Date().toISOString(),
      })

      // Ghostpool gateway hint: emit an engine event
      await supabase.from("engine_events").insert({
        actor_id: userId,
        event_type: `aemail_ai_${promptMode}`,
        payload: { email_id: emailId || null },
        created_at: new Date().toISOString(),
      })
    }
  } catch {
    // swallow (don’t ruin UX)
  }

  return { result }
}
