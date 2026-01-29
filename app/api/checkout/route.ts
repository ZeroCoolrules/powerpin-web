export const runtime = "nodejs"

import Stripe from "stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set")
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })

    const body = await req.json()
    const { price_id, success_url, cancel_url } = body

    if (!price_id || !success_url || !cancel_url) {
      return NextResponse.json(
        { error: "missing_parameters" },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      success_url,
      cancel_url,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Stripe checkout error:", err)
    return NextResponse.json(
      { error: "checkout_failed" },
      { status: 500 }
    )
  }
}
