'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);

  function enterGateway() {
    setEntering(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 900);
  }

  return (
    <main
      className={`min-h-screen bg-black flex items-center justify-center transition-all duration-700
      ${entering ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
    >
      <div className="text-center">
        {/* Gateway Image */}
        <div className="mb-10 flex justify-center">
          <img
            src="/aes-gateway.png"
            alt="AES Gateway"
            className="w-[280px] md:w-[360px] animate-pulse drop-shadow-[0_0_30px_#00ff88]"
          />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-green-400 mb-4 tracking-wide">
          PoWERPiN
        </h1>

        <p className="text-gray-400 mb-10">
          Gateway to Proof • Intent • Trust
        </p>

        {/* Enter Button */}
        <button
          onClick={enterGateway}
          className="px-10 py-4 border border-green-400 text-green-400
                     hover:bg-green-400 hover:text-black
                     transition-all duration-300 tracking-widest"
        >
          ENTER GATEWAY
        </button>
      </div>
    </main>
  );
}
