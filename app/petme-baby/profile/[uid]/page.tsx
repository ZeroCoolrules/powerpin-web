import { supabase } from "@/lib/supabase";

type Profile = {
  user_id: string;
  username: string | null;
  email: string;
  created_at: string | null;
};

type Listing = {
  id: number;
  title: string;
  species: string | null;
  breed: string | null;
  price: number | null;
  city: string | null;
  state: string | null;
  image_url: string | null;
};

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_id, username, email, created_at")
    .eq("user_id", uid)
    .single();

  const { data: listings, error: listingsError } = await supabase
    .from("pet_listings")
    .select("id, title, species, breed, price, city, state, image_url")
    .eq("seller_uid", uid)
    .order("id", { ascending: false });

  if (profileError) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold text-red-400">Profile Error</h1>
        <p className="mt-3 text-zinc-300">{profileError.message}</p>
      </main>
    );
  }

  if (listingsError) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold text-red-400">Listings Error</h1>
        <p className="mt-3 text-zinc-300">{listingsError.message}</p>
      </main>
    );
  }

  const user = profile as Profile;
  const sellerListings = (listings || []) as Listing[];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-green-500/20 bg-zinc-950 p-6">
          <h1 className="text-4xl font-bold text-green-400">
            {user.username || "Unnamed Seller"}
          </h1>
          <p className="mt-3 text-zinc-300">{user.email}</p>
          <p className="mt-1 text-xs text-zinc-500">{user.user_id}</p>
        </div>

        <h2 className="text-2xl font-semibold mt-8">Listings</h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-5">
          {sellerListings.map((listing) => (
            <div
              key={listing.id}
              className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950"
            >
              <div className="h-52 bg-zinc-900">
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
                <h3 className="text-lg font-semibold">{listing.title}</h3>
                <p className="mt-2 text-green-400">
                  {listing.price ? `$${listing.price}` : "Price on request"}
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  {[listing.species, listing.breed].filter(Boolean).join(" • ")}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {[listing.city, listing.state].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {!sellerListings.length && (
          <p className="mt-6 text-zinc-500">No listings for this seller yet.</p>
        )}
      </div>
    </main>
  );
}