"use client"

export default function Sidebar({
  currentFolder,
  onChangeFolder,
  children,
}: {
  currentFolder: string
  onChangeFolder: (folder: string) => void
  children?: React.ReactNode
}) {
  const folders = ["inbox", "sent", "drafts", "spam", "trash"]

  return (
    <div className="bg-[#0f172a]/60 border border-cyan-500/10 rounded-2xl p-4 flex flex-col h-[85vh]">

      {children}

      <nav className="flex flex-col gap-2 mt-4 text-sm">
        {folders.map((folder) => (
          <div
            key={folder}
            onClick={() => onChangeFolder(folder)}
            className={`
              px-4 py-2 rounded-lg cursor-pointer transition capitalize
              ${
                currentFolder === folder
                  ? "bg-cyan-500/10 text-cyan-300"
                  : "text-gray-400 hover:bg-cyan-500/5 hover:text-white"
              }
            `}
          >
            {folder}
          </div>
        ))}
      </nav>
    </div>
  )
}