"use client"

export default function EmailRow({
  sender,
  subject,
  preview,
  active,
  onClick,
}: {
  sender: string
  subject: string
  preview: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left rounded-xl px-4 py-3 border transition",
        active
          ? "border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_22px_rgba(0,229,255,0.14)]"
          : "border-cyan-500/10 bg-black/20 hover:bg-black/30 hover:border-cyan-500/20",
      ].join(" ")}
    >
      <div className="text-sm text-cyan-200 font-semibold truncate">{sender}</div>
      <div className="text-sm text-white/90 truncate mt-0.5">{subject}</div>
      <div className="text-xs text-gray-400 truncate mt-1">{preview}</div>
    </button>
  )
}
