import Nav from "@/app/components/Nav";

export default function Rooms() {
  return (
    <main className="min-h-screen bg-black text-green-400 p-10">
      <Nav /><br></br>
	  <h1 className="text-4xl font-extrabold mb-8">Streets / Rooms</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Room name="Exchange Room" />
        <Room name="Presence Room" />
        <Room name="Care Room" />
        <Room name="Build Room" />
      </div>
    </main>
  );
}

function Room({ name }: { name: string }) {
  return (
    <div className="border border-green-400 p-6 hover:bg-green-400 hover:text-black transition-all">
      {name}
    </div>
  );
}
