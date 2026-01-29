export default function ComposePage() {
  return (
    <div className="p-6">
      <input placeholder="To" />
      <input placeholder="Subject" />

      <textarea className="w-full h-64 mt-4" />

      <div className="mt-4 flex gap-2">
        <button>Send</button>
        <button>Save Draft</button>
        <button>Discard</button>
        <button>✍️ Write with Æi</button>
      </div>
    </div>
  )
}
