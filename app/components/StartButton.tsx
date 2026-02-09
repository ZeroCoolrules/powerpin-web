"use client"

import { useRouter } from "next/navigation"

export default function StartButton() {
  const router = useRouter()

  const handleCheckout = async () => {
  try {
    const res = await fetch("/api/checkout", { method: "POST" })
    const data = await res.json().catch(() => ({}))

    console.log("CHECKOUT:", res.status, data)

    if (res.status === 401) {
      router.push("/login")
      return
    }

    if (!res.ok) {
      alert(data?.error || data?.detail || "checkout_failed")
      return
    }

    const url = data?.url
    if (!url) {
      alert("missing_checkout_url")
      return
    }

    window.location.href = url
  } catch (err) {
    console.error(err)
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
