export const runtime = "nodejs"

import Stripe from "stripe"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  // 🔐 Stripe – runtime only
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
  })

  // 🔐 Supabase admin – runtime only
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  try {
    const { user_id } = await req.json()

    if (!user_id) {
      return NextResponse.json(
        { error: "missing_user_id" },
        { status: 400 }
      )
    }

    // Get Stripe customer ID
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user_id)
      .single()

    if (error || !data?.stripe_customer_id) {
      return NextResponse.json(
        { error: "customer_not_found" },
        { status: 404 }
      )
    }

    // Create Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/aeinbox`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err) {
    console.error("Portal error:", err)
    return NextResponse.json(
      { error: "portal_failed" },
      { status: 500 }
    )
  }
}
