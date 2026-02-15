export const runtime = "nodejs"

import Stripe from "stripe"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    })

    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const user_id = session.user.id

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user_id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: "customer_not_found" }, { status: 404 })
    }

    // 🔥 BUILD ABSOLUTE URL FROM REQUEST
    const origin = new URL(req.url).origin
    const returnUrl = `${origin}/aeinbox`

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: portalSession.url })

  } catch (err) {
    console.error("Stripe portal error:", err)
    return NextResponse.json({ error: "portal_failed" }, { status: 500 })
  }
}
