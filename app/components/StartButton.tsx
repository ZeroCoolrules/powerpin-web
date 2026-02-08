"use client"

import { useRouter } from "next/navigation"

export default function StartButton() {
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      })

      if (res.status === 401) {
        router.push("/login")
        return
      }

      if (!res.ok) {
        throw new Error("Checkout failed")
      }

      const { url } = await res.json()

      if (!url) {
        throw new Error("Missing checkout URL")
      }

      window.location.href = url
    } catch (err) {
      alert("Checkout failed. Please try again.")
      console.error(err)
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
