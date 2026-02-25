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
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-4 transition border ${
        active
          ? "bg-cyan-500/10 border-cyan-500/30"
          : "bg-[#0b1220] border-transparent hover:bg-white/5"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="font-medium text-white truncate">
          {sender}
        </div>
        <div className="text-xs text-gray-500">
          2h
        </div>
      </div>

      <div className="text-sm text-gray-300 truncate mt-1">
        {subject}
      </div>

      <div className="text-xs text-gray-500 truncate mt-1">
        {preview}
      </div>
    </div>
  )
}