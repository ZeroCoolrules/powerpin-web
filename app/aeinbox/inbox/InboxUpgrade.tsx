"use client"

import StartButton from "@/app/components/StartButton"

export default function InboxUpgrade() {
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <StartButton />
      <div className="text-xs opacity-60">
        Secure checkout · Cancel anytime
      </div>
    </div>
  )
}