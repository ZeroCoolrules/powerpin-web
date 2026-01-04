"use client";

import { motion } from "framer-motion";

const tiles = [
  {
    title: "Build AI Tools",
    desc: "Create GPTs for games, streets, contracts, or education.",
  },
  {
    title: "Deploy to Worlds",
    desc: "Attach AI to EndlessVR streets, casinos, and events.",
  },
  {
    title: "Automate Trust",
    desc: "Intent validation, contracts, scoring, and governance.",
  },
  {
    title: "Learn & Reprogram",
    desc: "Education, ethics, and skill pathways for PIN.",
  },
];

export default function GPTStoreSplash() {
  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-10">
        GPT Store
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tiles.map((tile, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 30px rgba(0,255,170,0.35)",
            }}
            className="rounded-2xl border border-green-500/30 bg-black/60 p-8 cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-green-300 mb-2">
              {tile.title}
            </h2>
            <p className="text-green-200/70">{tile.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
