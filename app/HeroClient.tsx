"use client";

import Link from "next/link";

export default function HeroClient() {
  return (
    <>
      <button onClick={() => console.log("clicked")}>
        Enter Gateway
      </button>

      <Link href="/system">System Architecture</Link>
    </>
  );
}
