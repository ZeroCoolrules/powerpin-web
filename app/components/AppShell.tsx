"use client";

import { usePathname } from "next/navigation";
import SideNav from "@/app/components/SideNav";
import TopNav from "@/app/components/TopNav";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCog = pathname.startsWith("/cog");

  return (
    <div className="flex min-h-screen">
      {!isCog && <SideNav />}

      <div className="flex-1 flex flex-col">
        {isCog && <TopNav />}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
