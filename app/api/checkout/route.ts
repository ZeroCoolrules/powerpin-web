import Stripe from "stripe"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    })

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: session.user.email!,
      line_items: [
        {
          price: "price_1SsMPTGotGAw4Xyoct48mgPc",
          quantity: 1,
        },
      ],
      success_url: "https://www.inboxae.com/aeinbox",
      cancel_url: "https://www.inboxae.com/aeinbox",
      metadata: {
        user_id: session.user.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 })
  }
}
