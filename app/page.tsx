import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-green-400 flex flex-col items-center justify-center p-10">
      
      {/* AES Gateway Image */}
      <div className="relative mb-10
                      hover:scale-105
                      transition-transform duration-500
                      shadow-[0_0_80px_rgba(0,255,140,0.35)]">
        <Image
          src="/aes-gateway.png"
          alt="AES Gateway"
          width={420}
          height={420}
          priority
        />
      </div>

      {/* Title */}
      <h1 className="text-5xl font-bold tracking-wide text-center">
        PoWERPiN
      </h1>

      <p className="mt-4 text-center text-green-300">
        Gateway to Proof · Intent · Trust
      </p>

      {/* Primary Entry */}
      <div className="mt-12">
        <a
          href="/dashboard"
          className="px-12 py-4 border border-green-400 text-lg
                     hover:bg-green-400 hover:text-black
                     transition-all
                     hover:shadow-[0_0_40px_rgba(0,255,140,0.4)]"
        >
          ENTER GATEWAY
        </a>
      </div>
    </main>
  );
}
