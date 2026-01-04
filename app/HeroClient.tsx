// app/HeroClient.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroClient() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
    >
      {/* Animated pulse */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex items-center justify-center"
      >
        <div className="h-56 w-56 rounded-full border border-green-500/30 blur-sm" />
        <div className="absolute h-40 w-40 rounded-full bg-green-500/10 blur-xl" />
      </motion.div>

      {/* CTA */}
      <div className="absolute bottom-[18%] pointer-events-auto">
        <Link
          href="/endless"
          className="rounded-xl border border-green-500/40 px-6 py-3
                     text-green-300 hover:bg-green-500/10
                     transition-all duration-300"
        >
          Enter Gateway
        </Link>
      </div>
    </motion.div>
  );
}
