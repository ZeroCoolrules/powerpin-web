"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateListingPage() {
  const [form, setForm] = useState({
    seller_uid: "",
    source: "petme",
    source_listing_id: "",
    title: "",
    description: "",
    species: "",
    breed: "",
    price: "",
    city: "",
    state: "",
    image_url: "",
    listing_url: "",
  });

  const [status, setStatus] = useState<string>("");

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Saving...");

    const sourceListingId =
      form.source_listing_id.trim() || `petme-${Date.now()}`;

    const payload = {
      seller_uid: form.seller_uid.trim() || null,
      source: form.source,
      source_listing_id: sourceListingId,
      title: form.title,
      description: form.description || null,
      species: form.species || null,
      breed: form.breed || null,
      price: form.price ? Number(form.price) : null,
      city: form.city || null,
      state: form.state || null,
      image_url: form.image_url || null,
      listing_url: form.listing_url,
      is_active: true,
    };

    const { error } = await supabase.from("pet_listings").insert(payload);

    if (error) {
      setStatus(`Error: ${error.message}`);
      return;
    }

    setStatus("Listing created successfully.");
    setForm({
      seller_uid: "",
      source: "petme",
      source_listing_id: "",
      title: "",
      description: "",
      species: "",
      breed: "",
      price: "",
      city: "",
      state: "",
      image_url: "",
      listing_url: "",
    });
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400">Create Listing</h1>
        <p className="mt-2 text-zinc-400">
          Add a PetMe.Baby listing directly into Supabase.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
        >
          <input
            value={form.seller_uid}
            onChange={(e) => updateField("seller_uid", e.target.value)}
            placeholder="Seller UID (optional)"
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={form.source}
              onChange={(e) => updateField("source", e.target.value)}
              placeholder="Source"
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
            />
            <input
              value={form.source_listing_id}
              onChange={(e) => updateField("source_listing_id", e.target.value)}
              placeholder="Source Listing ID (optional)"
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
            />
          </div>

          <input
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Title"
            required
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
          />

          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Description"
            rows={5}
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
          />

          <div className="grid md:grid-cols-3 gap-4">
            <input
              value={form.species}
              onChange={(e) => updateField("species", e.target.value)}
              placeholder="Species"
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
            />
            <input
              value={form.breed}
              onChange={(e) => updateField("breed", e.target.value)}
              placeholder="Breed"
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
            />
            <input
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="Price"
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="City"
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
            />
            <input
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              placeholder="State"
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
            />
          </div>

          <input
            value={form.image_url}
            onChange={(e) => updateField("image_url", e.target.value)}
            placeholder="Image URL"
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
          />

          <input
            value={form.listing_url}
            onChange={(e) => updateField("listing_url", e.target.value)}
            placeholder="Listing URL"
            required
            className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
          />

          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition"
          >
            Save Listing
          </button>

          {status ? <p className="text-sm text-zinc-300">{status}</p> : null}
        </form>
      </div>
    </main>
  );
}