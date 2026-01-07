export function CommandPalette({ commands, onInvoke }) {
  return (
    <div className="grid gap-2">
      {commands.map(cmd => (
        <button
          key={cmd.name}
          onClick={() => onInvoke(cmd.name)}
          className={`p-2 border rounded ${
            cmd.requiresApproval ? "border-yellow-500" : "border-green-500"
          }`}
        >
          <div className="font-mono">{cmd.name}</div>
          <div className="text-xs">{cmd.description}</div>
        </button>
      ))}
    </div>
  )
}
