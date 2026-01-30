"use client"

export default function StartButton() {
  async function startCheckout() {
    const res = await fetch("/api/checkout", { method: "POST" })
    const data = await res.json()

    if (!res.ok || !data?.url) {
      alert("Checkout failed")
      return
    }

    window.location.href = data.url
  }

  return (
    <button
      onClick={startCheckout}
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
