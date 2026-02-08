import Stripe from "stripe"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const runtime = "nodejs"

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // 1️⃣ Get auth session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // 2️⃣ Resolve email SAFELY (auth → profile fallback)
    let email = session.user.email ?? null

    if (!email) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("user_id", userId)
        .single()

      if (profileError || !profile?.email) {
        console.error("Missing email for checkout", {
          userId,
          profileError,
        })

        return NextResponse.json(
          { error: "email_missing" },
          { status: 400 }
        )
      }

      email = profile.email
    }

    // 3️⃣ Init Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    })

    // 4️⃣ Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],

      customer_email: email, // ✅ GUARANTEED NOW

      line_items: [
        {
          price: "price_1SsMPTGotGAw4Xyoct48mgPc",
          quantity: 1,
        },
      ],

      success_url: "https://www.inboxae.com/aeinbox",
      cancel_url: "https://www.inboxae.com/aeinbox",

      metadata: {
        user_id: userId,
        email, // 🔐 stored for webhook safety
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json(
      { error: "checkout_failed" },
      { status: 500 }
    )
  }
}
