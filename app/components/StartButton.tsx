"use client"

import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function StartButton() {
  const router = useRouter()

  const handleCheckout = async () => {
    const supabase = supabaseBrowser()

    // 1️⃣ Verify session FIRST
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      router.push("/login")
      return
    }

    // 2️⃣ Call checkout API
    const res = await fetch("/api/checkout", {
      method: "POST",
    })

    if (!res.ok) {
      alert("Checkout failed. Please try again.")
      return
    }

    const { url } = await res.json()

    if (!url) {
      alert("Missing checkout URL")
      return
    }

    // 3️⃣ Redirect to Stripe
    window.location.href = url
  }

  return (
    <button
      onClick={handleCheckout}
      style={{
        padding: "15px 30px",
        background: "#00ffa3",
        color: "#000",
        fontWeight: "bold",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
      }}
    >
      Start with Æi — $10/month
    </button>
  )
}
