import Nav from "@/app/components/Nav";
import Link from "next/link";

export default function Endless() {
  return (
    <main className="min-h-screen p-10">
      <Nav />

      <h1 className="text-4xl font-bold text-center mt-20">
        Endless Coin
      </h1>

      <p className="mt-6 text-center max-w-2xl mx-auto">
        Endless Coin represents infinite participation, circulation,
        and value generated through activity across Streets and Rooms.
      </p>

      {/* Back to Streets */}
      <div className="mt-10 text-center">
        <Link
          href="/streets"
          className="inline-block px-8 py-3 border border-current
                     hover:bg-current hover:text-black transition-all"
        >
          ← Back to Streets
        </Link>
      </div>
    </main>
  );
}
