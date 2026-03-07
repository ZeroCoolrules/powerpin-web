import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
            <Link
              key={profile.user_id}
              href={`/petme-baby/profile/${profile.user_id}`}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 hover:border-green-500/50 transition"
            >
              <h2 className="text-xl font-semibold">
                {profile.username || "Unnamed User"}
              </h2>
              <p className="mt-2 text-zinc-400">{profile.email}</p>
              <p className="mt-2 text-xs text-zinc-500">{profile.user_id}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}