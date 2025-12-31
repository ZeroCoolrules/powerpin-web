"use client";
import AppShell from "@/app/components/AppShell";
import { motion } from "framer-motion";
import Link from "next/link";

export default function EndlessVRSplash() {
  return (
    <AppShell>
    <div className="relative h-screen overflow-hidden bg-black text-white">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,170,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.9))]" />

      {/* Floating particles */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold tracking-wide text-green-400"
        >
          ENDLESSVR
        </motion.h1>

        <p className="mt-6 max-w-2xl text-green-200/80">
          Build streets. Launch worlds. Play, earn, and contribute through TIME.
          No borders. No extraction. Only intent.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mt-12"
        >
          <Link href="/endlessvr/world">
            <button className="px-10 py-4 rounded-2xl border border-green-400 bg-green-500/10
              text-lg font-bold tracking-widest
              hover:shadow-[0_0_40px_rgba(0,255,170,0.6)]">
              ENTER GATEWAY
            </button>
          </Link>
        </motion.div>

        <p className="mt-6 text-xs text-green-500/60">
          Non-political · Trust-scored · Intent-driven
        </p>
      </div>
    </div>
	</AppShell>
  );
}
