"use client"

export default function AIResponse({
  loading,
  output,
}: {
  loading: boolean
  output: string
}) {
  return (
    <div className="mt-6 rounded-2xl border border-cyan-500/15 bg-black/30 p-5">
      <div className="text-cyan-300 font-semibold">Æi</div>
      <pre className="mt-2 text-sm whitespace-pre-wrap text-gray-200">
        {loading ? "Thinking…" : output}
      </pre>
    </div>
  )
}
