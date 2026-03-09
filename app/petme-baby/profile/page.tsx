export const dynamic = "force-dynamic";
export const revalidate = 0;

import SellerCard from "@/components/petme/SellerCard";
import { supabase } from "@/lib/supabase";

type Profile = {
  user_id: string;
  username: string | null;
  email: string;
  created_at: string | null;
};

export default async function ProfilesPage() {
  const { data: listings, error: listingsError } = await supabase
    .from("pet_listings")
    .select("seller_uid")
    .not("seller_uid", "is", null);

  if (listingsError) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold text-red-400">Profiles Error</h1>
        <p className="mt-3 text-zinc-300">{listingsError.message}</p>
      </main>
    );
  }

  const sellerIds = Array.from(
    new Set((listings || []).map((row) => row.seller_uid).filter(Boolean))
  ) as string[];

  if (!sellerIds.length) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-green-400">Seller Profiles</h1>
          <div className="mt-8 text-zinc-500">No seller profiles found yet.</div>
        </div>
      </main>
    );
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("user_id, username, email, created_at")
    .in("user_id", sellerIds);

  if (profilesError) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold text-red-400">Profiles Error</h1>
        <p className="mt-3 text-zinc-300">{profilesError.message}</p>
      </main>
    );
  }

  const sortedProfiles = ((profiles || []) as Profile[]).sort((a, b) =>
    (a.username || a.email || "").localeCompare(b.username || b.email || "")
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400">Seller Profiles</h1>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {sortedProfiles.map((profile) => (
            <SellerCard key={profile.user_id} profile={profile} />
          ))}
        </div>
      </div>
    </main>
  );
}