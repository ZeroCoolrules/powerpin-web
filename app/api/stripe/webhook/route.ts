export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

function welcomeEmailText(usernameOrEmail: string) {
  return [
    `Welcome to AEmail.`,
    ``,
    `You're in.`,
    ``,
    `3 quick things to try:`,
    `• Open any email → hit 🧠 Summarize`,
    `• Try ✍️ Draft Reply (it matches your tone)`,
    `• Use 🛡️ Is This Safe? before clicking anything`,
    ``,
    `This inbox is part of a larger intelligence network. Subtle at first… then it surprises you.`,
    ``,
    `— Æi`,
  ].join("\n")
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "missing_STRIPE_SECRET_KEY" }, { status: 500 })
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "missing_STRIPE_WEBHOOK_SECRET" }, { status: 500 })
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: "missing_NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 })
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "missing_SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )

  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  if (!sig) return NextResponse.json({ error: "missing_signature" }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error("❌ stripe signature failed:", err?.message || err)
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const stripeCustomerId = (session.customer as string) || null
      const stripeSubscriptionId = (session.subscription as string) || null

      if (!stripeCustomerId || !stripeSubscriptionId) {
        console.warn("⚠️ missing stripe ids")
        return NextResponse.json({ received: true })
      }

      const userId =
        session.metadata?.user_id ||
        (session.client_reference_id ? String(session.client_reference_id) : null)

      const email =
        session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.email ||
        null

      if (!userId) {
        console.warn("⚠️ no userId mapped")
        return NextResponse.json({ received: true })
      }

      // Activate subscription row
      await supabaseAdmin
        .from("subscriptions")
        .upsert(
          {
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            status: "active",
          },
          { onConflict: "user_id" }
        )

      // Activate profile
      await supabaseAdmin
        .from("profiles")
        .update({
          stripe_customer_id: stripeCustomerId,
          subscription_status: "active",
          plan: "aeinbox_pro",
        })
        .eq("user_id", userId)

      // Create welcome email (safe insert: uses fields you already select)
      // If your emails table requires different columns, tell me the columns and I’ll map it.
      await supabaseAdmin.from("emails").insert({
		user_id: userId,
		from_name: "AEmail",
		subject: "Welcome to AEmail",
		summary: "Your AI-powered inbox is now active.",
		received_at: new Date().toISOString()
	  })

    }

    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription
      const status = sub.status === "active" || sub.status === "trialing" ? "active" : "inactive"
      const current_period_end = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null

      await supabaseAdmin
        .from("subscriptions")
        .update({ status, current_period_end })
        .eq("stripe_subscription_id", sub.id)

      if (status === "inactive") {
        await supabaseAdmin
          .from("profiles")
          .update({ subscription_status: "inactive", plan: "free" })
          .eq("stripe_customer_id", sub.customer as string)
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription

      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", sub.id)

      await supabaseAdmin
        .from("profiles")
        .update({ subscription_status: "inactive", plan: "free" })
        .eq("stripe_customer_id", sub.customer as string)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("🔥 webhook crashed:", err)
    return NextResponse.json({ error: "webhook_failed" }, { status: 500 })
  }
}
