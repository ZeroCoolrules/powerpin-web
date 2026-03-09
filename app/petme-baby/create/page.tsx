"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function CreateListingPage() {
  const supabase = supabaseBrowser();

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
    record_type: "",
    provider_name: "",
    note: "",
    document_url: "",
  });

  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadSellerProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (profile?.user_id) {
        setForm((prev) => ({ ...prev, seller_uid: profile.user_id }));
      }
    }

    loadSellerProfile();
  }, [supabase]);

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus("Uploading image...");

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `pet-${Date.now()}.${ext}`;
    const filePath = `pet-listings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("petme-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setUploading(false);
      setStatus(`Image upload failed: ${uploadError.message}`);
      return;
    }

    const { data } = supabase.storage.from("petme-images").getPublicUrl(filePath);

    setForm((prev) => ({
      ...prev,
      image_url: data.publicUrl,
    }));

    setUploading(false);
    setStatus("Image uploaded.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Saving listing...");

    const sourceListingId =
      form.source_listing_id.trim() || `petme-${Date.now()}`;

    const listingPayload = {
      seller_uid: form.seller_uid.trim() || null,
      source: form.source.trim() || "petme",
      source_listing_id: sourceListingId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      species: form.species.trim() || null,
      breed: form.breed.trim() || null,
      price: form.price ? Number(form.price) : null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      image_url: form.image_url.trim() || null,
      listing_url: form.listing_url.trim(),
      is_active: true,
    };

    const { data: listingData, error: listingError } = await supabase
      .from("pet_listings")
      .insert(listingPayload)
      .select("id")
      .single();

    if (listingError || !listingData) {
      setStatus(`Error saving listing: ${listingError?.message || "Unknown error"}`);
      return;
    }

    if (form.record_type.trim()) {
      setStatus("Saving health record...");

      const recordPayload = {
        listing_id: listingData.id,
        record_type: form.record_type.trim(),
        provider_name: form.provider_name.trim() || null,
        note: form.note.trim() || null,
        document_url: form.document_url.trim() || null,
      };

      const { error: recordError } = await supabase
        .from("health_records")
        .insert(recordPayload);

      if (recordError) {
        setStatus(`Listing saved, but health record failed: ${recordError.message}`);
        return;
      }
    }

    setStatus("Listing created successfully.");

    setForm((prev) => ({
      ...prev,
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
      record_type: "",
      provider_name: "",
      note: "",
      document_url: "",
    }));
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400">Create Listing</h1>
        <p className="mt-2 text-zinc-400">
          Add a PetMe.Baby listing and optional health record.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
        >
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Listing Info</h2>

            <div className="space-y-4">
              <input
                value={form.seller_uid}
                readOnly
                placeholder="Seller UID"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-400"
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
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
              />

              <input
                value={form.listing_url}
                onChange={(e) => updateField("listing_url", e.target.value)}
                placeholder="Listing URL"
                required
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Optional Health Record
            </h2>

            <div className="space-y-4">
              <input
                value={form.record_type}
                onChange={(e) => updateField("record_type", e.target.value)}
                placeholder="Record Type"
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
                placeholder="Health notes"
                rows={4}
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
              />

              <input
                value={form.document_url}
                onChange={(e) => updateField("document_url", e.target.value)}
                placeholder="Document URL"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="px-5 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Save Listing"}
          </button>

          {status ? <p className="text-sm text-zinc-300">{status}</p> : null}
        </form>
      </div>
    </main>
  );
}