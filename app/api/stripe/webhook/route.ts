export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

/* ===============================
   STRIPE
================================ */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

/* ===============================
   WEBHOOK HANDLER
================================ */
export async function POST(req: NextRequest) {
  /* ===============================
     SUPABASE ADMIN (RUNTIME ONLY)
     ⚠️ MUST BE INSIDE HANDLER
  =============================== */
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
    }
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
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        if (!userId) break

        await supabaseAdmin
          .from("subscriptions")
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: "active",
          })
          .eq("user_id", userId)

        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription

        const status =
          sub.status === "active" || sub.status === "trialing"
            ? "active"
            : "canceled"

        const current_period_end = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status,
            current_period_end,
          })
          .eq("stripe_subscription_id", sub.id)

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook handler crashed:", err)
    return NextResponse.json({ error: "webhook_failed" }, { status: 500 })
  }
}
