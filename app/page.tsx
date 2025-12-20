export default function Home() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-green-400 mb-6 tracking-wide">
          PoWERPiN
        </h1>

        <p className="text-gray-400 mb-10">
          Gateway to Proof • Intent • Trust
        </p>

        <a
          href="/dashboard"
          className="inline-block px-10 py-4 border border-green-400 text-green-400
                     hover:bg-green-400 hover:text-black transition-all duration-300"
        >
          ENTER GATEWAY
        </a>
      </div>
    </main>
  );
}
