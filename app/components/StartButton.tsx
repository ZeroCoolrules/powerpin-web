"use client"

export default function StartButton() {
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Checkout API failed")
      }

      const { url } = await res.json()

      if (!url) {
        throw new Error("No checkout URL returned")
      }

      window.location.href = url
    } catch (err) {
      console.error("Checkout failed:", err)
      alert("Checkout failed. Please try again.")
    }
  }

  return (
    <button
      onClick={handleCheckout}
      className="px-6 py-3 border border-green-500 text-green-400 hover:bg-green-900"
    >
      Start with ÆInbox + Æi — $10/month 
    </button>
  )
}