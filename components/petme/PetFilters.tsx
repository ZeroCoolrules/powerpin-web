"use client";

import { useMemo, useState } from "react";

type PetListing = {
  id: number;
  title: string;
  description?: string | null;
  species?: string | null;
  breed?: string | null;
  price?: number | null;
  city?: string | null;
  state?: string | null;
  image_url?: string | null;
  listing_url: string;
  seller_uid?: string | null;
};

export default function PetFilters({
  listings,
  render,
}: {
  listings: PetListing[];
  render: (filtered: PetListing[]) => React.ReactNode;
}) {
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("all");

  const speciesOptions = useMemo(() => {
    const set = new Set<string>();
    for (const listing of listings) {
      if (listing.species) set.add(listing.species);
    }
    return ["all", ...Array.from(set).sort()];
  }, [listings]);

  const filtered = useMemo(() => {
    return listings.filter((listing) => {
      const haystack = [
        listing.title,
        listing.description,
        listing.species,
        listing.breed,
        listing.city,
        listing.state,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesSpecies = species === "all" || listing.species === species;

      return matchesSearch && matchesSpecies;
    });
  }, [listings, search, species]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search pets, breed, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-green-500"
        />

        <select
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-green-500"
        >
          {speciesOptions.map((option) => (
            <option key={option} value={option}>
              {option === "all" ? "All species" : option}
            </option>
          ))}
        </select>
      </div>

      {render(filtered)}
    </div>
  );
}