"use client";

import { motion } from "framer-motion";

// Demo lock state
const isLocked = true; // demo mode

export default function RoomPage() {
  return (
    <div className="min-h-screen bg-black p-10 text-white">

      {/* Header with Lock State */}
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-3xl font-bold text-green-400">
          Room: Strategy Chamber
        </h1>

        {isLocked && (
          <span className="px-3 py-1 text-xs rounded-full border border-green-500/40 text-green-300">
            🔒 Invite Only
          </span>
        )}
      </div>

      <p className="text-green-200/70 mb-10">
        Private or semi-private collaboration space.
      </p>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { k: "Access", v: "Invite Only" },
          { k: "Capacity", v: "12" },
          { k: "Mode", v: "Discussion / AI Assist" },
        ].map((i, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-green-500/30 bg-black/60 p-5"
          >
            <div className="text-xs uppercase text-green-500">{i.k}</div>
            <div className="text-lg text-green-200">{i.v}</div>
          </div>
        ))}
      </div>

      {/* Capabilities */}
      <section className="rounded-2xl border border-green-500/30 bg-black/60 p-6 mb-10">
        <h2 className="text-xl text-green-300 mb-3">Capabilities</h2>
        <ul className="space-y-2 text-green-200/70">
          <li>• Voice / Text sessions</li>
          <li>• GPT assistance</li>
          <li>• Learning modules</li>
        </ul>
      </section>

      {/* Access Restricted Notice */}
      {isLocked && (
        <div className="mb-12 rounded-xl border border-green-500/30 bg-black/70 p-6 text-green-300/70">
          Access is restricted. Invitation or trust threshold required.
        </div>
      )}

      {/* Stop Line */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-center rounded-2xl border border-green-500/40 bg-black/80 p-8"
      >
        <div className="text-green-400 tracking-widest font-bold">
          LIVE SESSIONS · RECORDING · PAYMENTS
        </div>
        <div className="text-green-300/70 uppercase mt-2">
          Coming Soon
        </div>
      </motion.div>

    </div>
  );
}
