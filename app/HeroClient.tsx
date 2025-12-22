"use client";

import Link from "next/link";

export default function HeroClient() {
  return (
    <main className="min-h-screen bg-gate text-white flex flex-col items-center">

      {/* =========================
          HERO / GATEWAY
      ========================== */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

        {/* Visual-only gateway */}
        <div className="gateway-container pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="gateway-ring">
            <div className="gateway-core" />
          </div>
        </div>

        {/* Interactive content */}
        <div className="relative z-20 text-center px-6">

          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight glow-text">
            PoWERPiN
          </h1>

          <p className="text-sm uppercase tracking-widest text-cyan-300 mt-4">
            Gateway to Proof • Intent • Trust
          </p>

          {/* ↓↓ 2 breaks */}
          <p className="text-base text-slate-300 max-w-md mx-auto mt-8">
            The system is live. Entry is intentional.
          </p>

          {/* ↓↓ 4 breaks */}
          <div className="mt-16 flex gap-4 justify-center">
            <Link href="/system" className="btn-primary">
              Enter Gateway
            </Link>

            <button
              className="btn-secondary"
              onClick={() =>
                document
                  .getElementById("system-console")
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
      <section className="guided-path">
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
      <section id="system-console" className="system-console">

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

        <div className="console-actions">
          <Link href="/system" className="btn-secondary">
            System Architecture
          </Link>
        </div>
      </section>

      {/* =========================
          PROOF LOGS
      ========================== */}
      <section id="proof-logs" className="proof-logs">
        <h3>Proof Logs</h3>
        <ul>
          <li>✔ Signal integrity verified</li>
          <li>✔ Intent classification completed</li>
          <li>✔ Trust state propagated</li>
          <li className="dim">↻ Continuous verification active</li>
        </ul>
      </section>

    </main>
  );
}
