import Nav from "@/app/components/Nav";

export default function Dashboard() {
  const stats = [
    { label: "Requests", value: 1 },
    { label: "Decisions", value: 1 },
    { label: "Settlements", value: 0 },
  ];

  return (
    <main className="min-h-screen bg-black text-green-400 p-10">
      <Nav />

      <h1 className="text-4xl font-bold text-center mt-20">
        PoWERPiN Dashboard
      </h1>

      <p className="text-center mt-4 text-green-300">
        Live system snapshot — proof, intent, and trust
      </p>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {stats.map((item) => (
          <div
            key={item.label}
            className="border border-green-400 p-10 text-center
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
        <a
          href="/streets"
          className="px-10 py-4 border border-green-400
                     hover:bg-green-400 hover:text-black
                     transition-all"
        >
          Enter Streets
        </a>

        <a
          href="/endless"
          className="px-10 py-4 border border-green-400
                     hover:bg-green-400 hover:text-black
                     transition-all"
        >
          Endless Coin
        </a>

        <a
          href="/time"
          className="px-10 py-4 border border-green-400
                     hover:bg-green-400 hover:text-black
                     transition-all"
        >
          Time Coin
        </a>
      </div>
    </main>
  );
}
