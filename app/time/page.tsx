import Nav from "@/app/components/Nav";
import Link from "next/link";

export default function Time() {
  return (
	<main className="min-h-screen p-10">
      <Nav />

      <h1 className="text-4xl font-bold text-center mt-20">Time Coin</h1>

      <p className="mt-6 text-center max-w-2xl mx-auto">
        Time Coin measures proof of presence, duration, and contribution across Streets and Rooms.
      </p>

      {/* 👇 ADD THIS BLOCK RIGHT HERE */}
      <div className="mt-10 text-center">
        <a
          href="/streets"
          className="inline-block px-8 py-3 border border-green-400
                     hover:bg-green-400 hover:text-black transition-all"
        >
          ← Back to Streets
        </a>
      </div>

    </main>
  );
}
