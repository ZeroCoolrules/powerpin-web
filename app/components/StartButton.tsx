"use client"

export default function StartButton() {
  async function startCheckout() {
    const res = await fetch("/api/checkout", { method: "POST" })
    if (!res.ok) {
      alert("Checkout failed")
      return
    }
    const data = await res.json()
    window.location.href = data.url
  }

  return (
    <button
      onClick={startCheckout}
      style={{
        padding: "14px 36px",
        borderRadius: 999,
        background: "#22f3b1",
        color: "#020617",
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 0 40px rgba(34,243,177,.45)",
      }}
    >
      Start with Æi — $10/month
    </button>
  )
}
