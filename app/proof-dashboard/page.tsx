"use client";

import { motion } from "framer-motion";

const mockEvents = [
  "Intent Recorded → POW-α92",
  "TIME Earned → +3.5",
  "Ghost Pool Lock → ACTIVE",
  "Trust Score Updated → 78",
  "Contract Fulfilled → PIN-204",
];

export default function ProofDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-green-400 mb-6">
        Proof of Intent — Live Feed
      </h1>

      <div className="space-y-4">
        {mockEvents.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0.8],
              boxShadow: [
                "0 0 0 rgba(0,255,170,0)",
                "0 0 25px rgba(0,255,170,0.5)",
                "0 0 10px rgba(0,255,170,0.2)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3 + i,
            }}
            className="rounded-lg bg-black/60 border border-green-500/30 px-6 py-4 text-green-200"
          >
            {event}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
