"use client"

import StartButton from "@/app/components/StartButton"

export default function InboxUpgrade() {
  return (
    <div className="relative mt-10 flex flex-col items-center">

      {/* Cyan Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse" />

      {/* Upgrade Card */}
      <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-cyan-500/20 bg-[#111827]/60 backdrop-blur-xl rounded-xl p-4 mb-4 hover:border-cyan-400 transition shadow-[0_0_40px_rgba(0,229,255,0.15)] text-center">

        <h2 className="text-2xl font-semibold text-cyan-400 mb-2">
          Upgrade to AEmail
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Unlock secure, AI-powered email.
        </p>

        <StartButton />

        <div className="mt-4 text-xs text-cyan-300/70">
          Secure checkout · Cancel anytime
        </div>

      </div>
    </div>
  )
}
