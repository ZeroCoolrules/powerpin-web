import Link from "next/link";

export default function PetMeBabyHomePage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="border border-green-500/30 rounded-2xl p-8 bg-zinc-950 shadow-lg shadow-green-500/10">
          <h1 className="text-4xl md:text-5xl font-bold text-green-400">
            PetMe.Baby
          </h1>

          <p className="mt-4 text-zinc-300 text-lg max-w-2xl">
            Rare pets, trusted listings, health records, breeder profiles, and
            eventually crypto-powered pet transactions inside the PoWERPiN ecosystem.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/petme-baby/listings"
              className="px-5 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition"
            >
              Browse Listings
            </Link>

            <Link
              href="/petme-baby/profile"
              className="px-5 py-3 rounded-xl border border-green-500 text-green-400 hover:bg-green-500/10 transition"
            >
              Seller Profiles
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold text-green-400">Verified Data</h2>
            <p className="mt-2 text-zinc-400">
              Listings can connect to health data, seller history, and profile records.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold text-green-400">Mobile First</h2>
            <p className="mt-2 text-zinc-400">
              Built for fast listing search and easy contact from phone or desktop.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold text-green-400">Future Ready</h2>
            <p className="mt-2 text-zinc-400">
              Ready for QR health records, wallet payments, AI matching, and chat.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}