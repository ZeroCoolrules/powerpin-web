export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 })
  }

  try {
    /* ===============================
       CHECKOUT COMPLETED
    =============================== */
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const email = session.customer_email
      if (!email) throw new Error("Missing customer_email")

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("user_id")
        .eq("email", email)
        .single()

      if (!profile) throw new Error("Profile not found")

      await supabaseAdmin.from("subscriptions").upsert({
        user_id: profile.user_id,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        status: "active",
      })

      await supabaseAdmin
        .from("profiles")
        .update({
          stripe_customer_id: session.customer as string,
          subscription_status: "active",
          plan: "aeinbox_pro",
        })
        .eq("user_id", profile.user_id)
    }

    /* ===============================
       SUBSCRIPTION UPDATED
    =============================== */
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription

      const status =
        sub.status === "active" || sub.status === "trialing"
          ? "active"
          : "inactive"

      await supabaseAdmin
        .from("subscriptions")
        .update({
          status,
          current_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
        })
        .eq("stripe_subscription_id", sub.id)

      if (status === "inactive") {
        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "inactive",
            plan: "free",
          })
          .eq("stripe_customer_id", sub.customer as string)
      }
    }

    /* ===============================
       SUBSCRIPTION DELETED
    =============================== */
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription

      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", sub.id)

      await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: "inactive",
          plan: "free",
        })
        .eq("stripe_customer_id", sub.customer as string)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook handler crashed:", err)
    return NextResponse.json({ error: "webhook_failed" }, { status: 500 })
  }
}
