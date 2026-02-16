"use client"

import Image from "next/image"
import Link from "next/link"
import MilestoneAnnouncement from "@/app/components/MilestoneAnnouncement"


export default function AEmailLanding() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Deep background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,229,255,0.12),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,229,255,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#060B16] via-[#070F1D] to-black pointer-events-none" />

      {/* NAV */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
        <Image
          src="/aemail-wordmark.png"
          alt="AEmail"
          width={200}
          height={60}
          priority
        />
        <Link
          href="/login"
          className="text-sm text-gray-400 hover:text-cyan-400 transition duration-200"
        >
          Sign in
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32 text-center">

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
          A smarter inbox.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">
            Without the surveillance.
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed">
          Private email. Built-in AI. Zero ads. Zero tracking.  
          Just signal.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">

          <Link
            href="/register"
            className="px-10 py-5 rounded-xl bg-cyan-500 text-black font-semibold text-lg
            shadow-[0_0_40px_rgba(0,229,255,0.5)]
            hover:bg-cyan-400 hover:shadow-[0_0_60px_rgba(0,229,255,0.8)]
            hover:-translate-y-1 transition duration-200"
          >
            Get AEmail — $10/month
          </Link>

          <Link
            href="/login"
            className="px-10 py-5 rounded-xl border border-cyan-500/30 text-cyan-300 text-lg
            hover:border-cyan-400 hover:text-white transition duration-200"
          >
            Sign in
          </Link>

        </div>
		 {/* 🔥 LIVE DISTRIBUTION ANNOUNCEMENT */}
			<MilestoneAnnouncement className="mt-12 border border-green-500/30 rounded-xl p-6 bg-[#0F172A]/80 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,100,0.15)] animate-pulse"
			/>

      </section>

	  {/* FEATURE STRIP */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-28">

        <div className="grid md:grid-cols-3 gap-16 text-center">

          <Feature
            title="Built-in AI"
            desc="Summarize. Rewrite. Draft. Instantly. Æi works with you — not instead of you."
          />

          <Feature
            title="Private by Design"
            desc="No advertising model. No tracking pixels. Your conversations stay yours."
          />

          <Feature
            title="Threat Detection"
            desc="AI-assisted phishing protection that cuts through noise before it hits you."
          />

        </div>

      </section>

      {/* AI DEMO */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32">

        <div className="bg-[#0B1220]/90 border border-cyan-500/20 rounded-2xl p-10 shadow-[0_0_60px_rgba(0,229,255,0.15)]">

          <h2 className="text-3xl font-semibold text-center mb-6 text-cyan-400">
            See Æi in action
          </h2>

          <div className="bg-black rounded-xl p-6 text-sm text-gray-300 space-y-6">

            <div>
              <p className="text-gray-500 mb-2">Incoming Email</p>
              <p>
                “Hey team — following up on Q3 projections, vendor contracts,
                and the revised deployment timeline…”
              </p>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <p className="text-cyan-400 font-semibold mb-2">Æi Summary</p>
              <p>
                Vendor review required. Deployment timeline shifted.
                Action items assigned to finance and operations.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 text-center pb-40">

        <div className="max-w-xl mx-auto border border-cyan-500/20 rounded-2xl p-10 bg-[#0F172A]/80 shadow-[0_0_60px_rgba(0,229,255,0.1)]">

          <h3 className="text-4xl font-bold mb-4">
            $10 / month
          </h3>

          <p className="text-gray-400 mb-8">
            Private email + AI assistant. Cancel anytime.
          </p>

          <Link
            href="/register"
            className="px-10 py-5 rounded-xl bg-cyan-500 text-black font-semibold
            hover:bg-cyan-400 transition duration-200 shadow-[0_0_40px_rgba(0,229,255,0.5)]"
          >
            Start Now
          </Link>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-10 text-center text-xs text-gray-600 pb-10 border-t border-gray-900 pt-8">
        <div className="mb-4">
          <Link href="/privacy" className="mx-3 hover:text-cyan-400 transition">Privacy</Link>
          ·
          <Link href="/terms" className="mx-3 hover:text-cyan-400 transition">Terms</Link>
          ·
          <Link href="/security" className="mx-3 hover:text-cyan-400 transition">Security</Link>
        </div>
        <div>
          © 2026 AEmail · An Archway Power productt
        </div>
      </footer>

    </main>
  )
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-cyan-400 mb-4">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed">
        {desc}
      </p>
    </div>
  )
}
