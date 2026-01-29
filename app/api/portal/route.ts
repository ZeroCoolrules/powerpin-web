exporexport const runtime = "nodejs"

import Stripe from "stripe"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    /* ===============================
       STRIPE (server runtime only)
    =============================== */
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    })

    /* ===============================
       SUPABASE ADMIN (service role)
    =============================== */
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false },
      }
    )

    /* ===============================
       INPUT
    =============================== */
    const body = await req.json()
    const { user_id } = body

    if (!user_id) {
      return NextResponse.json(
        { error: "missing_user_id" },
        { status: 400 }
      )
    }

    /* ===============================
       VALIDATE USER EXISTS
       (prevents ID spoofing)
    =============================== */
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(user_id)

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "invalid_user" },
        { status: 401 }
      )
    }

    /* ===============================
       LOOK UP STRIPE CUSTOMER
    =============================== */
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user_id)
      .single()

    if (subError || !subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: "customer_not_found" },
        { status: 404 }
      )
    }

    /* ===============================
       CREATE STRIPE PORTAL SESSION
    =============================== */
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/aeinbox`,
    })

    /* ===============================
       SUCCESS
    =============================== */
    return NextResponse.json({
      url: portalSession.url,
    })
  } catch (err) {
    console.error("Stripe portal error:", err)

    return NextResponse.json(
      { error: "portal_failed" },
      { status: 500 }
    )
  }
}
