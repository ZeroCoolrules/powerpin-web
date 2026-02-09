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
      error,
    } = await supabase.auth.getSession()

    if (error || !session?.user) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 })
    }

    const email = session.user.email
    if (!email) {
      return NextResponse.json({ error: "missing_email" }, { status: 400 })
    }

    const userId = session.user.id

    // ✅ Ensure there is a subscriptions row BEFORE Stripe checkout
    // (prevents webhook update failures)
    await supabase.from("subscriptions").upsert(
      {
        user_id: userId,
        status: "inactive",
      },
      { onConflict: "user_id" }
    )

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    })

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: "price_1SsMPTGotGAw4Xyoct48mgPc", quantity: 1 }],
      success_url: "https://www.inboxae.com/aeinbox?checkout=success",
      cancel_url: "https://www.inboxae.com/aeinbox?checkout=cancel",
      metadata: {
        user_id: userId,
        email,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 })
  }
}
