export const runtime = "nodejs"

import Stripe from "stripe"
import { NextResponse } from "next/server"


export async function POST() {
  try {
	  export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set")
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  })

	}
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=1`,
      allow_promotion_codes: false,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error(err)
    return new NextResponse("Stripe error", { status: 500 })
  }
}
