"use client";

import { motion } from "framer-motion";

export default function StreetPage() {
  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-green-400">Street: Alpha Way</h1>
        <p className="text-green-200/70 mt-2">
          A public world space connecting storefronts and rooms.
        </p>
      </header>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { k: "Owner", v: "POW-α92" },
          { k: "Trust Level", v: "78" },
          { k: "Status", v: "Public" },
        ].map((i, idx) => (
          <div key={idx} className="rounded-xl border border-green-500/30 bg-black/60 p-5">
            <div className="text-xs uppercase text-green-500">{i.k}</div>
            <div className="text-lg text-green-200">{i.v}</div>
          </div>
        ))}
      </div>

      {/* Contents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="rounded-2xl border border-green-500/30 bg-black/60 p-6">
          <h2 className="text-xl text-green-300 mb-3">Storefronts</h2>
          <ul className="space-y-2 text-green-200/70">
            <li>• Casino Arcade (Demo)</li>
            <li>• AI Tools Hub (Demo)</li>
            <li>• Event Tickets (Demo)</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-green-500/30 bg-black/60 p-6">
          <h2 className="text-xl text-green-300 mb-3">Rooms</h2>
          <ul className="space-y-2 text-green-200/70">
            <li>• Strategy Room</li>
            <li>• Learning Room</li>
            <li>• Private Meeting</li>
          </ul>
        </section>
      </div>

      {/* Stop */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mt-12 text-center rounded-2xl border border-green-500/40 bg-black/80 p-8"
      >
        <div className="text-green-400 tracking-widest font-bold">EDIT · TRAFFIC · ECONOMICS</div>
        <div className="text-green-300/70 uppercase mt-2">Coming Soon</div>
      </motion.div>
    </div>
  );
}
