import { Resend } from "resend"

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY

  // ✅ Prevent build-time crash
  if (!apiKey) {
    console.warn("RESEND_API_KEY missing — welcome email skipped")
    return Response.json({ skipped: true }, { status: 200 })
  }

  const resend = new Resend(apiKey)

  const { email } = await req.json()

  if (!email) {
    return Response.json(
      { error: "Email required" },
      { status: 400 }
    )
  }

  await resend.emails.send({
    from: "ÆInbox <welcome@inboxae.com>",
    to: email,
    subject: "Welcome to ÆInbox",
    html: `
      <div style="font-family: system-ui; line-height: 1.6">
        <h2>Welcome to ÆInbox</h2>
        <p>Your email is confirmed. You're officially in.</p>
        <p>
          <a href="https://inboxae.com/login">
            Log in to your inbox
          </a>
        </p>
      </div>
    `,
  })

  return Response.json({ ok: true })
}
