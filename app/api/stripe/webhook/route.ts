export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "missing_stripe_env" }, { status: 500 })
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "missing_supabase_env" }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  })

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )

  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err: any) {
    console.error("Stripe signature failed:", err.message)
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const stripeCustomerId = session.customer as string
      const stripeSubscriptionId = session.subscription as string

      let userId =
        session.metadata?.user_id ||
        session.client_reference_id ||
        null

      if (!userId) {
        const email =
          session.customer_details?.email ||
          session.customer_email ||
          null

        if (email) {
          const { data: authUser } = await supabaseAdmin
            .schema("auth")
            .from("users")
            .select("id")
            .eq("email", email)
            .single()

          userId = authUser?.id ?? null
        }
      }

      if (!userId) {
        console.warn("Could not map session to user")
        return NextResponse.json({ received: true })
      }

      // Activate subscription
      await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          status: "active",
        },
        { onConflict: "user_id" }
      )

      await supabaseAdmin
        .from("profiles")
        .update({
          stripe_customer_id: stripeCustomerId,
          subscription_status: "active",
          plan: "aeinbox_pro",
        })
        .eq("user_id", userId)

      // Insert welcome email (prevent duplicate)
      const { data: existing } = await supabaseAdmin
        .from("messages")
        .select("id")
        .eq("user_id", userId)
        .eq("type", "welcome")
        .maybeSingle()

      if (!existing) {
        await supabaseAdmin.from("messages").insert({
          user_id: userId,
          folder: "inbox",
          from_name: "AEmail",
          from_email: "welcome@inboxae.com",
          subject: "Welcome to AEmail — You're In",
          body: `Welcome to AEmail.

Start by:
• Opening any email
• Clicking "Summarize with Æi"
• Drafting with AI

You’re early. That matters.

— Æi`,
          type: "welcome",
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook crash:", err)
    return NextResponse.json({ error: "webhook_failed" }, { status: 500 })
  }
}
