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
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, username, email, created_at")
    .order("created_at", { ascending: false })
    .limit(24);

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1 className="text-3xl font-bold text-red-400">Profiles Error</h1>
        <p className="mt-3 text-zinc-300">{error.message}</p>
      </main>
    );
  }

  const profiles = (data || []) as Profile[];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400">Seller Profiles</h1>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {profiles.map((profile) => (
            <SellerCard key={profile.user_id} profile={profile} />
          ))}
        </div>

        {!profiles.length && (
          <div className="mt-8 text-zinc-500">No profiles found yet.</div>
        )}
      </div>
    </main>
  );
}