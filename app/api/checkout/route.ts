import Stripe from "stripe"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const runtime = "nodejs"

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "missing_STRIPE_SECRET_KEY" }, { status: 500 })
    }
    if (!process.env.STRIPE_PRICE_ID) {
      return NextResponse.json({ error: "missing_STRIPE_PRICE_ID" }, { status: 500 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 })
    }

    const email = session.user.email
    if (!email) {
      return NextResponse.json({ error: "missing_email" }, { status: 400 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
    const priceId = process.env.STRIPE_PRICE_ID

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.inboxae.com"

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/aeinbox/inbox?paid=1`,
      cancel_url: `${siteUrl}/aeinbox/inbox?canceled=1`,
      metadata: {
        user_id: session.user.id,
        email,
      },
    })

    return NextResponse.json({ url: checkout.url })
  } catch (e: any) {
    console.error("checkout error:", e?.message || e)
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 })
  }
}
