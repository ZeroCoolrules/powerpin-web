export const runtime = "nodejs"

import Stripe from "stripe"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not set")
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          // 🔴 PUT YOUR REAL PRICE ID HERE
          price: "price_1SsMPTGotGAw4Xyoct48mgPc",
          quantity: 1,
        },
      ],
      success_url: "https://inboxae.com/aeinbox",
      cancel_url: "https://inboxae.com/aeinbox",
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json(
      { error: "checkout_failed" },
      { status: 500 }
    )
  }
}

