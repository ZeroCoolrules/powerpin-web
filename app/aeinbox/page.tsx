"use client"

import Image from "next/image"
import Link from "next/link"

export default function AEmailLanding() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] text-white relative overflow-hidden">

      {/* Soft Cyan Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,229,255,0.08),transparent_60%)] pointer-events-none" />

      {/* NAV */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <Image
          src="/aemail-wordmark.png"
          alt="AEmail"
          width={190}
          height={50}
          priority
        />
        <Link
          href="/login"
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Sign in
        </Link>
      </nav>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 pt-28 pb-32 text-center">

        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight mb-6">
          A smarter inbox.
          <br />
          <span className="text-cyan-400">Without the surveillance.</span>
        </h1>

        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          AEmail combines private email with built-in AI assistance.  
          No ads. No tracking. No noise.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/aeinbox/inbox"
            className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 hover:-translate-y-0.5 duration-200"
          >
            Get AEmail — $10/month
          </Link>

          <Link
            href="/login"
            className="px-8 py-4 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white transition"
          >
            Sign in
          </Link>
        </div>

      </section>

      {/* FEATURE GRID */}
      <section className="max-w-6xl mx-auto px-6 pb-32">

        <div className="grid md:grid-cols-3 gap-12">

          <Feature
            title="Built-in AI"
            desc="Draft, rewrite, and summarize instantly. Æi works with you, not instead of you."
          />

          <Feature
            title="Private by Design"
            desc="No advertising model. Your conversations stay yours."
          />

          <Feature
            title="Threat Detection"
            desc="AI-assisted phishing detection keeps suspicious emails from wasting your time."
          />

        </div>

      </section>

      {/* DEMO BLOCK */}
      <section className="max-w-4xl mx-auto px-6 pb-32 text-center">

        <div className="bg-[#111827]/80 border border-cyan-500/20 rounded-2xl p-10 shadow-[0_0_40px_rgba(0,229,255,0.12)] backdrop-blur-xl">

          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">
            See Æi in action
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Paste a long email thread. Get a clean summary in seconds.
          </p>

          <div className="bg-[#0B1220] rounded-xl p-4 text-left text-sm text-gray-300">
            <p className="opacity-60 mb-3">Incoming Email:</p>
            <p className="mb-4">
              “Hey team, following up on the Q3 projections, vendor contracts,
              and revised deployment schedule…”
            </p>

            <div className="border-t border-gray-800 pt-4 mt-4">
              <p className="text-cyan-400 font-semibold mb-2">Æi Summary:</p>
              <p>
                Q3 projections require vendor review. Deployment timeline shifted.
                Action items assigned to finance and ops.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* PRICING */}
      <section className="max-w-3xl mx-auto px-6 pb-32 text-center">

        <div className="border border-gray-800 rounded-2xl p-10 bg-[#0F172A]/80 backdrop-blur-xl">

          <h3 className="text-3xl font-semibold mb-4">
            $10 / month
          </h3>

          <p className="text-gray-400 mb-8">
            Private email + AI assistant.  
            Cancel anytime.
          </p>

          <Link
            href="/aeinbox/inbox"
            className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition shadow-lg shadow-cyan-500/20"
          >
            Start now
          </Link>

        </div>

      </section>

      {/* SUBTLE GATEWAY HINT */}
      <footer className="text-center text-xs text-gray-600 pb-10">
        Part of a larger intelligence network...
      </footer>

    </main>
  )
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="text-left">
      <h3 className="text-xl font-semibold text-cyan-400 mb-3">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  )
}
