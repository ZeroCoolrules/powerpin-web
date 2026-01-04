"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "Streets",
    desc: "Your primary world space. Streets connect storefronts, rooms, and experiences.",
    status: "active",
  },
  {
    title: "Storefronts",
    desc: "Public-facing spaces for games, casinos, AI tools, or commerce.",
    status: "active",
  },
  {
    title: "Rooms",
    desc: "Private or semi-private spaces for meetings, play, or learning.",
    status: "active",
  },
];

export default function StreetBuilder() {
  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Street Builder
      </h1>

      <p className="max-w-3xl text-green-200/70 mb-10">
        EndlessVR is organized into modular spaces. You don’t build chaos —
        you build structure.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl border border-green-500/30 bg-black/60 p-6"
          >
            <h2 className="text-xl font-semibold text-green-300 mb-2">
              {section.title}
            </h2>
            <p className="text-green-200/70 mb-4">
              {section.desc}
            </p>
            <span className="text-xs uppercase tracking-widest text-green-500">
              Structure Ready
            </span>
          </motion.div>
        ))}
      </div>

      {/* STOP LINE */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-center rounded-2xl border border-green-500/40 bg-black/80 p-10"
      >
        <h2 className="text-2xl font-bold text-green-400 tracking-widest">
          VISUAL BUILDER · INTERACTION · DEPLOYMENT
        </h2>
        <p className="mt-4 text-green-300/70 uppercase tracking-wider">
          Coming Soon
        </p>
      </motion.div>
    </div>
  );
}
