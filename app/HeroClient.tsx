"use client";

import Link from "next/link";

export default function HeroClient() {
  return (
    <main className="min-h-screen bg-gate text-white flex flex-col items-center">

      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

        {/* Visual Layer */}
        <div className="gateway-container pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="gateway-ring">
            <div className="gateway-core" />
          </div>
        </div>

        {/* Content Layer */}
        <div className="relative z-20 text-center px-6">

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight glow-text">
            PoWERPiN
          </h1>

          <p className="text-sm uppercase tracking-widest text-cyan-300 mt-4">
            Gateway to Proof • Intent • Trust
          </p>

          {/* ↓↓ 2 breaks */}
          <div className="mt-8">
            <p className="text-base text-slate-300 max-w-md mx-auto">
              The system is live. Entry is intentional.
            </p>
          </div>

          {/* ↓↓ 2 breaks (push ring visually lower) */}
          <div className="mt-8" />

          {/* ↓↓ 4 breaks for buttons */}
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

      {/* SYSTEM CONSOLE TARGET */}
      <section id="system-console" className="system-console">
        {/* console content unchanged */}
      </section>

    </main>
  );
}
