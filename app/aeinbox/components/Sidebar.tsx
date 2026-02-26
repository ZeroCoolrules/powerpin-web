"use client"

export default function Sidebar({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <div className="bg-[#0f172a]/60 border border-cyan-500/10 rounded-2xl p-4 flex flex-col h-[85vh]">

      {/* Compose Area */}
      {children}

      {/* Navigation */}
      <nav className="flex flex-col gap-2 mt-4 text-sm">
        <SidebarItem label="Inbox" active />
        <SidebarItem label="Sent" />
        <SidebarItem label="Drafts" />
        <SidebarItem label="Spam" />
        <SidebarItem label="Trash" />
      </nav>
    </div>
  )
}

function SidebarItem({
  label,
  active,
}: {
  label: string
  active?: boolean
}) {
  return (
    <div
      className={`
        px-4 py-2 rounded-lg cursor-pointer transition
        ${active
          ? "bg-cyan-500/10 text-cyan-300"
          : "text-gray-400 hover:bg-cyan-500/5 hover:text-white"}
      `}
    >
      {label}
    </div>
  )
}