import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  const { email } = await req.json()

  await resend.emails.send({
    from: "ÆInbox <welcome@inboxae.com>",
    to: email,
    subject: "Welcome to ÆInbox",
    html: `
      <h2>Welcome to ÆInbox</h2>
      <p>Your email is confirmed. You're officially in.</p>
      <p><a href="https://inboxae.com/login">Log in</a></p>
    `,
  })

  return Response.json({ ok: true })
}
