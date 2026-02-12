"use client"

function StartCTA() {
  async function goToBilling() {
    const res = await fetch("/api/portal", { method: "POST" })
    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <button
      onClick={goToBilling}
      className="mt-4 border border-green-600 px-4 py-2"
    >
      Manage Billing
    </button>
  )
}

export default function BillingPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl mb-2">Activate Æmail</h1>
      <p className="opacity-70">Subscription required.</p>
      <StartCTA />
    </div>
  )
}
