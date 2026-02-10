export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  // ─────────────────────────────────────────────
  // Stripe
  // ─────────────────────────────────────────────
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "missing_STRIPE_SECRET_KEY" }, { status: 500 })
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "missing_STRIPE_WEBHOOK_SECRET" }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  })

  // ─────────────────────────────────────────────
  // Supabase Admin (service role)
  // ─────────────────────────────────────────────
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: "missing_NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 })
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "missing_SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )

  // ─────────────────────────────────────────────
  // Verify Stripe signature
  // ─────────────────────────────────────────────
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error("❌ Stripe signature verification failed:", err?.message || err)
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 })
  }

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────
  const resolveUserId = async (session: Stripe.Checkout.Session) => {
    // 1) Best: metadata.user_id (from your /api/checkout)
    const metaUserId = session.metadata?.user_id
    if (metaUserId) return metaUserId

    // 2) Fallback: find user by email stored in profiles.email (or whichever column you use)
    // Stripe may put email in different spots depending on how Checkout is created.
    let email =
      session.customer_details?.email ||
      session.customer_email ||
      session.metadata?.email ||
      null

    // If still missing, try retrieving the customer object
    if (!email && typeof session.customer === "string") {
      try {
        const customer = await stripe.customers.retrieve(session.customer)
        if (customer && !("deleted" in customer) && customer.email) {
          email = customer.email
        }
      } catch (e) {
        console.warn("⚠️ Could not retrieve Stripe customer for email fallback:", e)
      }
    }

    if (!email) return null

    // NOTE:
    // This assumes your `profiles` table has an `email` column.
    // If it doesn't, change `.eq("email", email)` to the correct column name.
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("user_id")
      .eq("email", email)
      .maybeSingle()

    if (error) {
      console.error("❌ profiles lookup by email failed:", error)
      return null
    }

    return profile?.user_id ?? null
  }

  const activateUser = async (args: {
    userId: string
    stripeCustomerId: string
    stripeSubscriptionId: string
  }) => {
    const { userId, stripeCustomerId, stripeSubscriptionId } = args

    // 1) Upsert subscription row
    const { error: subErr } = await supabaseAdmin.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      status: "active",
    })

    if (subErr) {
      console.error("❌ subscriptions upsert failed:", subErr)
      throw subErr
    }

    // 2) Update profile
    const { error: profErr } = await supabaseAdmin
      .from("profiles")
      .update({
        stripe_customer_id: stripeCustomerId,
        subscription_status: "active",
        plan: "aeinbox_pro",
      })
      .eq("user_id", userId)

    if (profErr) {
      console.error("❌ profiles update failed:", profErr)
      throw profErr
    }
  }

  // ─────────────────────────────────────────────
  // Handle events
  // ─────────────────────────────────────────────
  try {
    // ============================================
    // CHECKOUT COMPLETED (PRIMARY ACTIVATION)
    // ============================================
    if (event.type === "checkout.session.completed") {
  const session = event.data.object as Stripe.Checkout.Session

  const stripeCustomerId = session.customer as string | null
  const stripeSubscriptionId = session.subscription as string | null

  if (!stripeCustomerId || !stripeSubscriptionId) {
    console.warn("⚠️ Missing customer or subscription ID")
    return NextResponse.json({ received: true })
  }

  // ✅ 1) Try user id from metadata OR Buy Button client_reference_id
  let userId =
    session.metadata?.user_id ||
    (session.client_reference_id ? String(session.client_reference_id) : null)

  // ✅ 2) If still missing, try email -> auth.users lookup
  if (!userId) {
    const email =
      session.customer_details?.email ||
      session.customer_email ||
      session.metadata?.email ||
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
      console.warn("⚠️ Could not map Stripe session to a Supabase user")
        return NextResponse.json({ received: true })
     }

    await supabaseAdmin.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      status: "active",
    })

    await supabaseAdmin
      .from("profiles")
      .update({
        stripe_customer_id: stripeCustomerId,
        subscription_status: "active",
        plan: "aeinbox_pro",
      })
      .eq("user_id", userId)
  }
    // ============================================
    // SUBSCRIPTION UPDATED
    // ============================================
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription

      const status =
        sub.status === "active" || sub.status === "trialing" ? "active" : "inactive"

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

    // ============================================
    // SUBSCRIPTION DELETED (CANCELLED)
    // ============================================
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
    console.error("🔥 Webhook handler crashed:", err)
    return NextResponse.json({ error: "webhook_failed" }, { status: 500 })
  }
}
