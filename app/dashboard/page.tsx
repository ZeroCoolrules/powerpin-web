async function fetchCount(table: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_POWERPIN_URL}/rest/v1/${table}?select=id`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_POWERPIN_ANON_KEY!,
      },
      cache: 'no-store',
    }
  );

  const data = await res.json();
  return data.length;
}

export default async function Dashboard() {
  const [requests, decisions, settlements] = await Promise.all([
    fetchCount('deap2_requests_mirror'),
    fetchCount('deap2_decisions_mirror'),
    fetchCount('deap2_settlements_mirror'),
  ]);

  return (
    <main className="min-h-screen bg-black text-green-400 p-10">
      <h2 className="text-4xl font-bold mb-8">Powerpin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat title="Requests" value={requests} />
        <Stat title="Decisions" value={decisions} />
        <Stat title="Settlements" value={settlements} />
      </div>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="border border-green-400 p-6 text-center">
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <div className="text-5xl font-bold">{value}</div>
    </div>
  );
}
