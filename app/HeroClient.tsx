"use client";

import { useRouter } from "next/navigation";

export default function HeroClient() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gate text-white flex flex-col">

      {/* =========================
          HERO / GATEWAY (FULL VIEWPORT)
      ========================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* 🔮 Visual Layer */}
        <div className="gateway-container pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="gateway-ring">
            <div className="gateway-core" />
          </div>
        </div>

        {/* 🧠 Interactive Layer */}
        <div className="relative z-20 text-center space-y-8 px-6">

          <h1 className="text-6xl md:text-7xl font-semibold glow-text">
            PoWERPiN
          </h1>

          <p className="text-sm uppercase tracking-widest text-cyan-300">
            Gateway to Proof • Intent • Trust
          </p>

          <p className="text-base text-slate-300 max-w-md mx-auto">
            The system is live. Entry is intentional.
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <button
              className="btn-primary"
              onClick={() => router.push("/system")}
            >
              Enter Gateway
            </button>

            <button
              className="btn-secondary"
              onClick={() =>
                document
                  .getElementById("guided-path")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Observe the System
            </button>
          </div>

        </div>
      </section>

      {/* =========================
          GUIDED PATH
      ========================== */}
      <section
        id="guided-path"
        className="guided-path mt-24"
      >
        <div className="path-item">
          <h2>Proof</h2>
          <p>Signals verified. Reality anchored.</p>
        </div>

        <div className="path-item">
          <h2>Intent</h2>
          <p>Purpose measured before action.</p>
        </div>

        <div className="path-item">
          <h2>Trust</h2>
          <p>Access earned, not assumed.</p>
        </div>
      </section>

      {/* =========================
          SYSTEM CONSOLE
      ========================== */}
      <section className="system-console mt-32">

        <div className="console-header">
          <span className="console-dot green" />
          <span className="console-dot yellow" />
          <span className="console-dot red" />
          <span className="console-title">SYSTEM STATUS</span>
        </div>

        <div className="console-body">
          <div className="console-line">
            <span className="label">Proof Engine</span>
            <span className="value active">ACTIVE</span>
          </div>

          <div className="console-line">
            <span className="label">Intent Signal</span>
            <span className="value monitoring">MONITORING</span>
          </div>

          <div className="console-line">
            <span className="label">Trust Graph</span>
            <span className="value init">INITIALIZING</span>
          </div>

          <div className="console-line subtle">
            <span className="label">Last Verification</span>
            <span className="value">moments ago</span>
          </div>
        </div>
      </section>

    </main>
  );
}
