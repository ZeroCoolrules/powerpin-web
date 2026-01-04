"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  { id: "casino", label: "Casinos & Sweepstakes" },
  { id: "games", label: "Games & Experiences" },
  { id: "tools", label: "AI Tools & Services" },
];

export default function StorefrontIndex() {
  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Storefronts</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ scale: 1.04 }}
            className="rounded-2xl border border-green-500/30 bg-black/60 p-6"
          >
            <h2 className="text-xl text-green-300">{cat.label}</h2>
            <p className="text-green-200/70 mt-2">
              Public-facing experiences
            </p>

            <Link
              href={`/endless/storefronts/neon-arcade`}
              className="inline-block mt-4 text-green-400 hover:underline"
            >
              View Demo →
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center text-green-500/60 uppercase">
        More storefront types coming soon
      </div>
    </div>
  );
}
