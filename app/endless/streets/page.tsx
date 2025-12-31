"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const streets = [
  { id: "alpha-way", name: "Alpha Way", trust: 78 },
  { id: "green-river", name: "Green River Blvd", trust: 85 },
  { id: "aes-central", name: "AES Central", trust: 91 },
];

export default function StreetsIndex() {
  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Streets</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {streets.map((street) => (
          <motion.div
            key={street.id}
            whileHover={{ scale: 1.04 }}
            className="rounded-2xl border border-green-500/30 bg-black/60 p-6"
          >
            <h2 className="text-xl text-green-300">{street.name}</h2>
            <p className="text-green-200/70 mt-2">
              Trust Level: {street.trust}
            </p>

            <Link
              href={`/endless/streets/${street.id}`}
              className="inline-block mt-4 text-green-400 hover:underline"
            >
              Enter Street →
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
