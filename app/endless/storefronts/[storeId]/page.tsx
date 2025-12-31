"use client";

import { motion } from "framer-motion";

export default function StorefrontPage() {
  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-green-400">Storefront: Neon Arcade</h1>
        <p className="text-green-200/70 mt-2">
          Public experiences: games, casinos, and tools.
        </p>
      </header>

      {/* Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { t: "Games", d: "Skill-based, time-weighted play." },
          { t: "Sweepstakes", d: "Compliance-first prize experiences." },
          { t: "AI Tools", d: "GPT-powered interactions." },
        ].map((x, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(0,255,170,.35)" }}
            className="rounded-2xl border border-green-500/30 bg-black/60 p-6"
          >
            <h2 className="text-xl text-green-300 mb-2">{x.t}</h2>
            <p className="text-green-200/70">{x.d}</p>
          </motion.div>
        ))}
      </div>

      {/* Status */}
      <div className="rounded-xl border border-green-500/30 bg-black/60 p-6 mb-10">
        <div className="text-sm text-green-500 uppercase">Status</div>
        <div className="text-green-200">Demo · Read-Only</div>
      </div>

      {/* Stop */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-center rounded-2xl border border-green-500/40 bg-black/80 p-8"
      >
        <div className="text-green-400 tracking-widest font-bold">
          PLAY · PAYOUTS · DEPLOY
        </div>
        <div className="text-green-300/70 uppercase mt-2">Coming Soon</div>
      </motion.div>
    </div>
  );
}
