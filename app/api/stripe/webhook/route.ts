export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  /* ─────────────────────────────────────────────
     Stripe (runtime only)
  ───────────────────────────────────────────── */
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  })

  /* ─────────────────────────────────────────────
     Supabase Admin (service role)
  ───────────────────────────────────────────── */
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  /* ─────────────────────────────────────────────
     Verify Stripe signature
  ───────────────────────────────────────────── */
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json(
      { error: "missing_signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("❌ Stripe signature verification failed:", err.message)
    return NextResponse.json(
      { error: "invalid_signature" },
      { status: 400 }
    )
  }

  /* ─────────────────────────────────────────────
     Handle events
  ───────────────────────────────────────────── */
  try {
    /* ============================================
       CHECKOUT COMPLETED (PRIMARY ACTIVATION)
    ============================================ */
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.user_id
      if (!userId) {
        console.warn(
          "⚠️ checkout.session.completed without metadata.user_id (test event or misconfigured checkout)"
        )
        return NextResponse.json({ received: true })
      }

      const stripeCustomerId = session.customer as string | null
      const stripeSubscriptionId = session.subscription as string | null

      if (!stripeCustomerId || !stripeSubscriptionId) {
        console.warn("⚠️ Missing customer or subscription ID")
        return NextResponse.json({ received: true })
      }

      // 1️⃣ Upsert subscription record
      await supabaseAdmin.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        status: "active",
      })

      // 2️⃣ Activate profile
      await supabaseAdmin
        .from("profiles")
        .update({
          stripe_customer_id: stripeCustomerId,
          subscription_status: "active",
          plan: "aeinbox_pro",
        })
        .eq("user_id", userId)
    }

    /* ============================================
       SUBSCRIPTION UPDATED
    ============================================ */
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription

      const status =
        sub.status === "active" || sub.status === "trialing"
          ? "active"
          : "inactive"

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

    /* ============================================
       SUBSCRIPTION DELETED (CANCELLED)
    ============================================ */
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
    console.error("🔥 Webhook handler crashed:", err)
    return NextResponse.json(
      { error: "webhook_failed" },
      { status: 500 }
    )
  }
}
