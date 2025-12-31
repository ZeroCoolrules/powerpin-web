import AppShell from "@/app/components/AppShell";
import Link from "next/link";

export default function Streets() {
	
  return (
    <main className="min-h-screen p-10">
	<AppShell>

      <h1 className="text-4xl font-bold mb-10">Streets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Tile href="/streets/rooms" title="Rooms" desc="Intent spaces" />
        <Tile href="/endless" title="Endless Coin" desc="Participation flow" />
        <Tile href="/time" title="Time Coin" desc="Presence & duration" />
        <Tile href="/dashboard" title="Dashboard" desc="System snapshot" />
      </div>
	  </AppShell>
    </main>
	
  );
}

function Tile({ href, title, desc }: any) {
  return (
    <a
      href={href}
      className="border border-green-400 p-10
                 hover:bg-green-400 hover:text-black
                 transition-all duration-300"
    >
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-sm opacity-80">{desc}</p>
    </a>
  );
}
