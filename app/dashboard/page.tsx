import Link from "next/link";
import AppShell from "@/app/components/AppShell";

export default function Dashboard() {
  const stats = [
    { label: "Requests", value: 1 },
    { label: "Decisions", value: 1 },
    { label: "Settlements", value: 0 },
  ];

  return (
    <AppShell>
    <main className="min-h-screen p-10">
      

      {/* Title */}
      <h1 className="text-4xl font-bold text-center mt-20">
        PoWERPiN Dashboard
      </h1>

      <p className="text-center mt-4 opacity-80">
        Live system snapshot — proof, intent, and trust
      </p>

      {/* Stats Grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {stats.map((item) => (
          <div
            key={item.label}
            className="border border-current p-10 text-center
                       hover:shadow-[0_0_40px_rgba(0,255,140,0.35)]
                       transition-all"
          >
            <div className="text-lg uppercase tracking-wide">
              {item.label}
            </div>
            <div className="text-5xl font-bold mt-4">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Primary Navigation */}
      <div className="mt-16 flex flex-wrap justify-center gap-6">
        <Link
          href="/streets"
          className="px-10 py-4 border border-current
                     hover:bg-current hover:text-black
                     transition-all"
        >
          Enter Streets
        </Link>

        <Link
          href="/endless"
          className="px-10 py-4 border border-current
                     hover:bg-current hover:text-black
                     transition-all"
        >
          Endless Coin
        </Link>

        <Link
          href="/time"
          className="px-10 py-4 border border-current
                     hover:bg-current hover:text-black
                     transition-all"
        >
          Time Coin
        </Link>
      </div>
    </main>
	</AppShell>
  );
}
