type SellerProfile = {
  user_id: string;
  username?: string | null;
  email: string;
  created_at?: string | null;
};

export default function SellerCard({ profile }: { profile: SellerProfile }) {
  return (
    <a
      href={`/petme-baby/profile/${profile.user_id}`}
      className="block rounded-2xl border border-zinc-800 bg-zinc-950 p-5 hover:border-green-500/50 transition"
    >
      <h3 className="text-xl font-semibold text-white">
        {profile.username || "Unnamed Seller"}
      </h3>

      <p className="mt-2 text-zinc-400">{profile.email}</p>
      <p className="mt-2 text-xs text-zinc-500 break-all">{profile.user_id}</p>
    </a>
  );
}