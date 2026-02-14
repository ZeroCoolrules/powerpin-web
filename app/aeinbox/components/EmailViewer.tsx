"use client"

type Props = {
  subject: string
  sender: string
  body: string
}

export default function EmailViewer({ subject, sender, body }: Props) {
  return (
    <div className="flex-1 p-8">

      <h2 className="text-xl font-semibold">{subject}</h2>
      <p className="text-sm opacity-70 mt-1">From: {sender}</p>

      <div className="mt-6 text-sm leading-relaxed whitespace-pre-wrap">
        {body}
      </div>

      <div className="mt-8 flex gap-3">
        <button className="border border-cyan-500/20 px-4 py-2 rounded-lg">
          Reply
        </button>
        <button className="border border-cyan-500/20 px-4 py-2 rounded-lg">
          Archive
        </button>
        <button className="border border-cyan-500/20 px-4 py-2 rounded-lg">
          Delete
        </button>
      </div>

    </div>
  )
}
