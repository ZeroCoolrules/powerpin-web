"use client"

type Props = {
  email: any
  onClick: () => void
}

export default function EmailRow({ email, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left border border-cyan-500/10 p-3 rounded-lg hover:bg-cyan-500/5 transition"
    >
      <strong className="block text-sm">{email.from_name}</strong>
      <p className="text-xs opacity-70 truncate">
        {email.subject}
      </p>
    </button>
  )
}
