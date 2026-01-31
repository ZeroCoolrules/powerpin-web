import { Resend } from "resend"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY

  const { email } = await req.json()
  if (!email) {
    return Response.json({ error: "Email required" }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  // 🔹 Look up user
  const { data: user } = await supabase
    .from("auth.users")
    .select("id")
    .eq("email", email)
    .single()

  if (user) {
    // 🔹 Seed inbox welcome email (idempotent)
    await supabase.from("emails").insert({
      user_id: user.id,
      provider: "system",
      external_id: "welcome",
      from_name: "ÆInbox",
      from_email: "welcome@inboxae.com",
      subject: "Welcome to ÆInbox",
      summary:
        "Your inbox is live. AI protections and smart actions are coming online.",
      received_at: new Date().toISOString(),
    })
  }

  // 🔹 Email send (optional, safe)
  if (!apiKey) {
    return Response.json({ ok: true, seeded: true })
  }

  const resend = new Resend(apiKey)

  await resend.emails.send({
    from: "ÆInbox <welcome@inboxae.com>",
    to: email,
    subject: "Welcome to ÆInbox",
    html: `
      <div style="font-family: system-ui">
        <h2>Welcome to ÆInbox</h2>
        <p>Your inbox is live.</p>
        <a href="https://inboxae.com/login">Open Inbox</a>
      </div>
    `,
  })

  return Response.json({ ok: true })
}
