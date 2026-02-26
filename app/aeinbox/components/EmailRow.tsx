"use client"

export default function EmailRow({
  sender,
  subject,
  preview,
  active,
  unread = true,
  time = "2h",
  onClick,
}: {
  sender: string
  subject: string
  preview: string
  active: boolean
  unread?: boolean
  time?: string
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-xl px-4 py-3 transition-all duration-200
        ${active
          ? "bg-cyan-500/10 border border-cyan-500/30"
          : "hover:bg-cyan-500/5 border border-transparent"}
      `}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {unread && (
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
          )}
          <span className={`font-medium ${unread ? "text-white" : "text-gray-400"}`}>
            {sender}
          </span>
        </div>
        <span className="text-xs text-gray-500">{time}</span>
      </div>

      <div className="mt-1 font-semibold text-gray-200 truncate">
        {subject}
      </div>

      <div className="text-sm text-gray-500 truncate">
        {preview}
      </div>
    </div>
  )
}