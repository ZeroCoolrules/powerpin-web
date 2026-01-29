"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import StartButton from "@/components/StartButton"


export default function AEinboxLanding() {
  const router = useRouter()

  async function startCheckout() {
    const res = await fetch("/api/checkout", { method: "POST" })
    if (!res.ok) {
      alert("Checkout failed")
      return
    }
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 60%)",
        color: "#e5e7eb",
        padding: "120px 20px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* STAR FIELD */}
      <div className="starField" />

      {/* LOGO */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 40,
          position: "relative",
          zIndex: 3,
        }}
      >
        <Image
          src="/aeinbox-wordmark.png"
          alt="ÆInbox"
          width={343}
          height={80}
          priority
        />
      </div>

      {/* HERO */}
      <section style={{ position: "relative" }}>
        <div className="sectionPulse" />
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 600 }}>
            Secure Email. Intelligent Assistant. Human-First.
          </h1>

          <p
            style={{
              marginTop: 14,
              fontSize: "1.05rem",
              opacity: 0.85,
              maxWidth: 680,
              marginInline: "auto",
            }}
          >
            ÆInbox is a private inbox with a built-in AI assistant called Æi.
            No ads. No tracking. No data selling.
          </p>

          {/* CTA */}
          <div style={{ marginTop: 36 }}>
            <button onClick={() => router.push("/login")} style={ctaBtn}>
              Log in to get started
            </button>

            <div style={{ marginTop: 12, fontSize: 13 }}>
              New here?{" "}
              <button onClick={() => router.push("/register")} style={linkBtn}>
                Create an account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DIFFERENT */}
      <section style={{ marginTop: 90, position: "relative" }}>
        <div className="sectionPulse" />
        <div style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{ fontSize: "1.7rem", fontWeight: 600 }}>
            What Makes ÆInbox Different
          </h2>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              marginTop: 28,
              lineHeight: "2.1rem",
              fontSize: "1rem",
              opacity: 0.9,
            }}
          >
            <li>🔐 Privacy-first email</li>
            <li>🤖 Built-in AI assistant (Æi)</li>
            <li>🛡️ Phishing & threat awareness</li>
            <li>🌑 Clean dark-mode interface</li>
          </ul>
        </div>
      </section>

      {/* Æi ORB */}
      <section style={{ marginTop: 110, position: "relative" }}>
        <div
          style={{
            position: "relative",
            width: 160,
            height: 160,
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="beatPulse" />
          <Image
            src="/apple-touch-icon.png"
            alt="Æi"
            width={120}
            height={120}
            priority
            style={{ zIndex: 2 }}
          />
        </div>

        <h2 style={{ fontSize: "1.7rem", fontWeight: 600 }}>
          Meet Æi — Your AI Assistant
        </h2>

        <p
          style={{
            marginTop: 16,
            maxWidth: 620,
            marginInline: "auto",
            opacity: 0.8,
          }}
        >
          Æi drafts replies, summarizes long threads, flags suspicious
          messages, and helps you stay focused — not flooded.
        </p>
      </section>

      {/* PRICING */}
		  <section
			style={{
				marginTop: 110,
				position: "relative",
				overflow: "hidden",
			}}
		>
  
	  {/* SECTION PULSE */}
		<div className="sectionPulse" />

		{/* CONTENT */}
		<div
			style={{
		position: "relative",
		zIndex: 2,
		textAlign: "center",
		}}
	  >
    <h2 style={{ fontSize: "1.7rem", fontWeight: 600 }}>
      Pricing
    </h2>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 18,
        marginTop: 32,
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={startCheckout}
        className="priceCard featured"
        style={{ cursor: "pointer" }}
      >
        <strong>$10</strong>
        <div>Secure Email + AI</div>
        <small>Most Popular</small>
      </button>

      <div className="priceCard">
        <strong>$15</strong>
        <div>Pro Tier</div>
        <small>Coming Soon</small>
      </div>
    </div>

    <p
      style={{
        marginTop: 28,
        fontSize: 13,
        opacity: 0.6,
        letterSpacing: "0.02em",
        textAlign: "center",
        maxWidth: 360,
        marginInline: "auto",
      }}
    >
       No ads · No tracking · Cancel anytime
    </p>
  </div>
</section>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: 120,
          fontSize: 12,
          opacity: 0.45,
          textAlign: "center",
        }}
      >
        Powered by Archway Power · © 2026 ÆInbox
      </footer>

      {/* STYLES */}
      <style>{`
        .starField {
          position: absolute;
          top: -220px;
          left: 0;
          width: 100%;
          height: 460px;
          background:
            radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,.8), transparent),
            radial-gradient(1px 1px at 25% 40%, rgba(255,255,255,.6), transparent),
            radial-gradient(1px 1px at 40% 15%, rgba(255,255,255,.7), transparent),
            radial-gradient(1px 1px at 60% 30%, rgba(255,255,255,.6), transparent),
            radial-gradient(1px 1px at 75% 10%, rgba(255,255,255,.8), transparent),
            radial-gradient(1px 1px at 90% 35%, rgba(255,255,255,.6), transparent);
          animation: starDrift 28s linear infinite;
          opacity: 0.6;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes starDrift {
          from { transform: translateY(0); }
          to { transform: translateY(140px); }
        }

        .beatPulse {
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(34,243,177,0.28) 0%,
            transparent 70%
          );
          animation: beat 3.2s ease-in-out infinite;
          z-index: 1;
          pointer-events: none;
        }

        @keyframes beat {
          0% { transform: scale(0.9); opacity: 0.25; }
          40% { transform: scale(1); opacity: 0.45; }
          100% { transform: scale(0.9); opacity: 0.25; }
        }

        .sectionPulse {
          position: absolute;
          inset: -40%;
          background: radial-gradient(
            circle,
            rgba(34,243,177,0.22) 0%,
            transparent 65%
          );
          animation: sectionBeat 6s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes sectionBeat {
          0% { transform: scale(0.96); opacity: 0.18; }
          50% { transform: scale(1); opacity: 0.32; }
          100% { transform: scale(0.96); opacity: 0.18; }
        }

        .priceCard {
          width: 190px;
          padding: 18px 14px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
          border: none;
          color: inherit;
        }

        .priceCard strong {
          font-size: 1.4rem;
        }

        .priceCard.featured {
          box-shadow:
            0 0 40px rgba(34,243,177,.35),
            inset 0 0 0 1px #22f3b1;
        }

        .priceCard small {
          display: block;
          margin-top: 4px;
          font-size: 11px;
          opacity: .65;
        }
      `}</style>
    </main>
  )
}

const ctaBtn: React.CSSProperties = {
  padding: "14px 36px",
  borderRadius: 999,
  background: "#22f3b1",
  color: "#020617",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
  boxShadow: "0 0 40px rgba(34,243,177,.45)",
}

const linkBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#22f3b1",
  fontWeight: 600,
  cursor: "pointer",
}
