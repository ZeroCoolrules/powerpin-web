import Link from "next/link";
import HealthRecordList from "@/components/petme/HealthRecordList";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  source?: string | null;
};

type SellerProfile = {
  user_id: string;
  username?: string | null;
  email: string;
};

type HealthRecord = {
  id: number;
  record_type: string;
  provider_name?: string | null;
  note?: string | null;
  document_url?: string | null;
  issued_at?: string | null;
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: listing, error: listingError } = await supabase
    .from("pet_listings")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (listingError || !listing) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-red-400">Listing Not Found</h1>
          <p className="mt-3 text-zinc-300">
            This listing could not be loaded.
          </p>
        </div>
      </main>
    );
  }

  const pet = listing as PetListing;

  let seller: SellerProfile | null = null;
  if (pet.seller_uid) {
    const { data: sellerData } = await supabase
      .from("profiles")
      .select("user_id, username, email")
      .eq("user_id", pet.seller_uid)
      .single();

    seller = sellerData as SellerProfile | null;
  }

  const { data: recordsData, error: recordsError } = await supabase
    .from("health_records")
    .select("*")
    .eq("listing_id", pet.id)
    .order("id", { ascending: false });

  const records = recordsError ? [] : ((recordsData || []) as HealthRecord[]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
            <div className="h-[420px] bg-zinc-900">
              {pet.image_url ? (
                <img
                  src={pet.image_url}
                  alt={pet.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  No image
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm uppercase tracking-wide text-zinc-500">
              {pet.source || "Pet Listing"}
            </p>

            <h1 className="mt-2 text-4xl font-bold text-green-400">
              {pet.title}
            </h1>

            <p className="mt-4 text-2xl font-semibold text-white">
              {pet.price ? `$${pet.price}` : "Price on request"}
            </p>

            <div className="mt-5 space-y-2 text-zinc-300">
              <p>
                <span className="text-zinc-500">Species:</span>{" "}
                {pet.species || "Unknown"}
              </p>
              <p>
                <span className="text-zinc-500">Breed:</span>{" "}
                {pet.breed || "Unknown"}
              </p>
              <p>
                <span className="text-zinc-500">Location:</span>{" "}
                {[pet.city, pet.state].filter(Boolean).join(", ") || "Unknown"}
              </p>
            </div>

            <p className="mt-6 text-zinc-300 leading-7">
              {pet.description || "No description available."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={pet.listing_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition"
              >
                View Source
              </a>

              {pet.seller_uid ? (
                <Link
                  href={`/petme-baby/profile/${pet.seller_uid}`}
                  className="px-4 py-2 rounded-lg border border-green-500 text-green-400 hover:bg-green-500/10 transition"
                >
                  Seller Profile
                </Link>
              ) : null}

              <Link
                href="/petme-baby/listings"
                className="px-4 py-2 rounded-lg border border-zinc-700 text-white hover:bg-zinc-900 transition"
              >
                Back to Listings
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Health Records</h2>
            <HealthRecordList records={records} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Seller</h2>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              {seller ? (
                <>
                  <h3 className="text-xl font-semibold text-green-400">
                    {seller.username || "Unnamed Seller"}
                  </h3>
                  <p className="mt-3 text-zinc-300">{seller.email}</p>
                  <p className="mt-2 text-xs text-zinc-500 break-all">
                    {seller.user_id}
                  </p>

                  <Link
                    href={`/petme-baby/profile/${seller.user_id}`}
                    className="inline-block mt-5 px-4 py-2 rounded-lg border border-green-500 text-green-400 hover:bg-green-500/10 transition"
                  >
                    View Seller Profile
                  </Link>
                </>
              ) : (
                <p className="text-zinc-500">No seller linked yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}