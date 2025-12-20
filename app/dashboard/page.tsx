export default function Dashboard() {
  return (
    <main className="min-h-screen bg-black text-green-400 p-10">
      <h2 className="text-4xl font-bold mb-6">Powerpin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-green-400 p-6">
          Requests
        </div>
        <div className="border border-green-400 p-6">
          Decisions
        </div>
        <div className="border border-green-400 p-6">
          Trust
        </div>
      </div>
    </main>
  );
}
