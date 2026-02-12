"use client"

import StartButton from "@/app/components/StartButton"

export default function InboxUpgrade() {
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <StartButton />
      <div className="className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl transition"
">
        Secure checkout · Cancel anytime
      </div>
    </div>
  )
}