"use client"

import EmailRow from "./EmailRow"

export default function EmailList({
  emails,
  selectedId,
  onSelect,
}: {
  emails: { id: string; sender: string; subject: string; preview: string }[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="rounded-2xl border border-cyan-500/15 bg-[#0f172a]/60 backdrop-blur-xl overflow-hidden">
      <div className="px-4 py-4 border-b border-cyan-500/10 flex items-center justify-between">
        <div className="font-semibold text-cyan-200">Inbox</div>
        <div className="text-xs text-gray-500">{emails.length}</div>
      </div>

      <div className="p-2 max-h-[78vh] overflow-auto">
        <div className="space-y-2">
          {emails.map((e) => (
            <EmailRow
              key={e.id}
              sender={e.sender}
              subject={e.subject}
              preview={e.preview}
              active={e.id === selectedId}
              onClick={() => onSelect(e.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
