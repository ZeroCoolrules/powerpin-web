"use client"

import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function StartButton() {
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      const supabase = supabaseBrowser()
      const { data } = await supabase.auth.getSession()

      // 🔐 Not logged in → redirect to login
      if (!data.session) {
        router.push("/login")
        return
      }

      // 💳 Create Stripe checkout
      const res = await fetch("/api/checkout", {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Checkout API failed")
      }

      const { url } = await res.json()

      if (!url) {
        throw new Error("Missing checkout URL")
      }

      // 🚀 Redirect to Stripe Checkout
      window.location.href = url
    } catch (err) {
      console.error("Checkout failed:", err)
      alert("Checkout failed. Please try again.")
    }
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
