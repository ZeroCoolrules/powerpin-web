"use client";

import { motion } from "framer-motion";

export default function TokensSplash() {
  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Endless & TIME Token
      </h1>

      <p className="max-w-3xl text-green-200/80 mb-8">
        Endless and TIME form the economic backbone of the ecosystem.
        TIME is earned through contribution. Endless is minted through
        trust-weighted intent.
      </p>

      {/* EDUCATION BLOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="rounded-xl border border-green-500/30 bg-black/60 p-6">
          <h2 className="text-xl text-green-300 mb-2">TIME</h2>
          <p className="text-green-200/70">
            TIME represents verified effort, learning, building, and contribution.
            It cannot be bought — only earned.
          </p>
        </div>

        <div className="rounded-xl border border-green-500/30 bg-black/60 p-6">
          <h2 className="text-xl text-green-300 mb-2">Endless</h2>
          <p className="text-green-200/70">
            Endless is minted when TIME, trust, and intent align.
            It fuels access, streets, games, and pooled incentives.
          </p>
        </div>
      </div>

      {/* HARD STOP */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="text-center rounded-2xl border border-green-500/40 bg-black/80 p-10"
      >
        <h2 className="text-2xl font-bold text-green-400 tracking-widest">
          MINTING · BRANDING · EXTERNAL USE
        </h2>
        <p className="mt-4 text-green-300/70 uppercase tracking-wider">
          Coming Soon
        </p>
      </motion.div>
    </div>
  );
}
