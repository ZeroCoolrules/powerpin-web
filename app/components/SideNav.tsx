"use client";

import Link from "next/link";

export default function SideNav() {
  return (
    <aside className="w-56 border-r border-neutral-800 p-4">
      <h2 className="text-green-400 font-bold mb-4">PoWERPiN</h2>
      <nav className="flex flex-col gap-3 text-sm">
        <Link href="/">Home</Link>
        <Link href="/cog">COG</Link>
        <Link href="/trust">Trust</Link>
        <Link href="/ghostpool">Ghost Pool</Link>
        <Link href="/about">About</Link>
      </nav>
    </aside>
  );
}
