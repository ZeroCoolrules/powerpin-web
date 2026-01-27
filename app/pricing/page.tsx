"use client";

async function goCheckout() {
  const res = await fetch("/api/checkout", { method: "POST" });
  if (!res.ok) {
    alert("Checkout failed");
    return;
  }
  const { url } = await res.json();
  window.location.href = url;
}

export default function PricingPage() {
  return (
    <section style={{ paddingTop: 80, textAlign: "center" }}>
      <h1 style={{ fontSize: 48, marginBottom: 24 }}>$10 / month</h1>
      <p style={{ opacity: 0.7, marginBottom: 40 }}>
        Private inbox. No ads. No tracking. Human-first AI.
      </p>
      <button
        onClick={goCheckout}
        style={{
          background: "#34d399",
          color: "#000",
          padding: "16px 40px",
          borderRadius: 14,
          fontWeight: 700,
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        Unlock ÆInbox — $10/month
      </button>
    </section>
  );
}
