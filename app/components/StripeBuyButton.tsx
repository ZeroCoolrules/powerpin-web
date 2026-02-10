"use client"

import Script from "next/script"

export default function StripeBuyButton({
  userId,
  email,
}: {
  userId?: string
  email?: string
}) {
  return (
    <>
      <Script
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="afterInteractive"
      />

      {/* @ts-ignore - stripe-buy-button is a custom element */}
      <stripe-buy-button
        buy-button-id="buy_btn_1Sz4avGotGAw4Xyo8rnBWanl"
        publishable-key="pk_live_51SsJCsGotGAw4XyouxsVzLaH8y6dEvQGXLTFGxw2xSkNWXQPZRPquv3VPjiGTRza5ROfMbbtcBSSGwzAlXLefNlD00xd5viazV"
        // THESE TWO FIX “WHO PAID?”:
        client-reference-id={userId || ""}
        customer-email={email || ""}
      />
    </>
  )
}
