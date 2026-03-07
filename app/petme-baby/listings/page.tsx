import { supabase } from "@/lib/supabase";

type PetListing = {
  id: number;
  title: string;
  description: string | null;
  species: string | null;
  breed: string | null;
  price: number | null;
  city: string | null;
  state: string | null;
  image_url: string | null;
  listing_url: string;
  seller_uid: string | null;
  created_at?: string;
};

export default async function PetListingsPage() {
  const { data, error } = await supabase
    .from("pet_listings")
    .select("*")
    .order("id", { ascending: false })
    .limit(24);

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-red-400">Listings Error</h1>
          <p className="mt-3 text-zinc-300">{error.message}</p>
        </div>
      </main>
    );
  }

  const listings = (data || []) as PetListing[];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400">Pet Listings</h1>
        <p className="mt-2 text-zinc-400">
          Browse imported and platform-created pet listings.
        </p>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950"
            >
              <div className="h-56 bg-zinc-900">
                {listing.image_url ? (
                  <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    No image
                  </div>
                )}
              </div>

              <div className="p-5">
                <h2 className="text-xl font-semibold text-white">{listing.title}</h2>

                <p className="mt-2 text-green-400 font-medium">
                  {listing.price ? `$${listing.price}` : "Price on request"}
                </p>

                <p className="mt-2 text-sm text-zinc-400">
                  {[listing.species, listing.breed].filter(Boolean).join(" • ") || "Unknown type"}
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  {[listing.city, listing.state].filter(Boolean).join(", ") || "Location unknown"}
                </p>

                <p className="mt-4 text-sm text-zinc-300 line-clamp-4">
                  {listing.description || "No description available."}
                </p>

                <div className="mt-5 flex gap-3">
                  <a
                    href={listing.listing_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400"
                  >
                    View Source
                  </a>

                  {listing.seller_uid && (
                    <a
                      href={`/petme-baby/profile/${listing.seller_uid}`}
                      className="px-4 py-2 rounded-lg border border-green-500 text-green-400 hover:bg-green-500/10"
                    >
                      Seller
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!listings.length && (
          <div className="mt-10 text-zinc-500">No listings found yet.</div>
        )}
      </div>
    </main>
  );
}