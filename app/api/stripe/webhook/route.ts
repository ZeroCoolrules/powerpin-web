import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabaseAdmin } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.user_id
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      if (!userId) break

      await supabaseAdmin
        .from("subscriptions")
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: "active",
        })
        .eq("user_id", userId)

      break
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription

      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: sub.status === "active" ? "active" : "canceled",
          current_period_end: new Date(
            sub.current_period_end * 1000
          ).toISOString(),
        })
        .eq("stripe_subscription_id", sub.id)

      break
    }
  }

  return NextResponse.json({ received: true })
}
