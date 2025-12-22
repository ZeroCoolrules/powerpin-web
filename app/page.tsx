import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gate text-white flex flex-col items-center justify-center">
      
      {/* =========================
          HERO / GATEWAY SECTION
      ========================== */}
      <section className="relative w-full flex items-center justify-center py-24">

        {/* 🔮 Visual Layer (NON-INTERACTIVE) */}
        <div className="gateway-container pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="gateway-ring">
            <div className="gateway-core" />
          </div>
        </div>

        {/* 🧠 Interactive Layer */}
        <div className="relative z-20 text-center space-y-8 px-6">

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight glow-text">
            PoWERPiN
          </h1>

          {/* Subheading */}
          <p className="text-sm uppercase tracking-widest text-cyan-300">
            Gateway to Proof • Intent • Trust
          </p>

          {/* AI Guide Line */}
          <p className="text-base text-slate-300 max-w-md mx-auto">
            The system is live. Entry is intentional.
          </p>

          {/* CTAs */}
          <div className="flex gap-4 justify-center pt-6">
            <button className="btn-primary">
              ENTER GATEWAY TEST 123
            </button>

            <button className="btn-secondary">
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
      <section className="system-console">

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

          <button
            className="btn-secondary"
            onClick={() =>
              document
                .getElementById("proof-logs")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View Proof Logs
          </button>

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
