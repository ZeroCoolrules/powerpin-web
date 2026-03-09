"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AddHealthRecordPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const listingId = Number(params.id);

  const [form, setForm] = useState({
    record_type: "",
    provider_name: "",
    note: "",
    document_url: "",
  });

  const [status, setStatus] = useState("");

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Saving health record...");

    const payload = {
      listing_id: listingId,
      record_type: form.record_type.trim(),
      provider_name: form.provider_name.trim() || null,
      note: form.note.trim() || null,
      document_url: form.document_url.trim() || null,
    };

    const { error } = await supabase.from("health_records").insert(payload);

    if (error) {
      setStatus(`Error: ${error.message}`);
      return;
    }

    setStatus("Health record added.");
    router.push(`/petme-baby/listings/${listingId}`);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400">Add Health Record</h1>
        <p className="mt-2 text-zinc-400">
          Add a health record to listing #{listingId}.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
        >
          <input
            value={form.record_type}
            onChange={(e) => updateField("record_type", e.target.value)}
            placeholder="Record Type"
            required
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
          />

          <input
            value={form.provider_name}
            onChange={(e) => updateField("provider_name", e.target.value)}
            placeholder="Provider Name"
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
          />

          <textarea
            value={form.note}
            onChange={(e) => updateField("note", e.target.value)}
            placeholder="Notes"
            rows={5}
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
          />

          <input
            value={form.document_url}
            onChange={(e) => updateField("document_url", e.target.value)}
            placeholder="Document URL"
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition"
            >
              Save Health Record
            </button>

            <button
              type="button"
              onClick={() => router.push(`/petme-baby/listings/${listingId}`)}
              className="px-5 py-3 rounded-xl border border-zinc-700 text-white hover:bg-zinc-900 transition"
            >
              Cancel
            </button>
          </div>

          {status ? <p className="text-sm text-zinc-300">{status}</p> : null}
        </form>
      </div>
    </main>
  );
}