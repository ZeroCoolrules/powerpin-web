export default function Sidebar() {
  return (
    <div className="space-y-3 text-sm">
      <SidebarItem label="Inbox" active />
      <SidebarItem label="Sent" />
      <SidebarItem label="Drafts" />
      <SidebarItem label="Spam" />
      <SidebarItem label="Trash" />
    </div>
  )
}

function SidebarItem({
  label,
  active = false,
}: {
  label: string
  active?: boolean
}) {
  return (
    <div
      className={`px-4 py-2 rounded-lg cursor-pointer transition ${
        active
          ? "bg-cyan-500/20 text-cyan-300"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </div>
  )
}