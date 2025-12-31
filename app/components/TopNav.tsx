"use client";

import Link from "next/link";

export default function TopNav() {
  return (
    <header className="h-16 border-b border-neutral-800 flex items-center px-6">
      <nav className="flex gap-6 text-sm">
        <Link href="/">Home</Link>
        <Link href="/trust">Trust</Link>
        <Link href="/ghostpool">Ghost Pool</Link>
      </nav>
    </header>
  );
}
