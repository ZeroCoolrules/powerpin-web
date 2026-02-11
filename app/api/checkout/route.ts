import Stripe from "stripe"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const runtime = "nodejs"

export async function POST() {
  try {
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

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    })
	console.log("STRIPE KEY PREFIX:", process.env.STRIPE_SECRET_KEY?.slice(0, 5))
    const priceId = process.env.STRIPE_PRICE_ID
    if (!priceId) {
      return NextResponse.json({ error: "missing_price_id" }, { status: 500 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://www.inboxae.com/aeinbox?checkout=success",
      cancel_url: "https://www.inboxae.com/aeinbox?checkout=cancel",
      metadata: {
        user_id: session.user.id,
        email,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err: any) {
    console.error("Checkout error:", err)
    return NextResponse.json(
      { error: err?.message ?? "checkout_failed" },
      { status: 500 }
    )
  }
}
