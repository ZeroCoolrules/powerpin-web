"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./lib/auth";
import { qp } from "./lib/paths";

const NAV: { href: string; label: string; wideOnly?: boolean }[] = [
  { href: "discover", label: "Discover" },
  { href: "feed", label: "Feed" },
  { href: "matches", label: "Matches" },
  { href: "meetups", label: "Meetups" },
  { href: "chats", label: "Chats" },
  { href: "coach", label: "Coach" },
  { href: "blog", label: "Blog", wideOnly: true },
  { href: "profile", label: "Profile" },
];

// Pages anyone can see; everything else needs a signed-in member.
const PUBLIC = ["", "join", "login", "blog", "in", "safety", "terms", "privacy", "guidelines"];
// Public pages that are drawn on the server, so search engines and link
// previews can read them. They render without waiting for the sign-in check.
const SERVER_DRAWN = ["blog", "terms", "privacy", "guidelines"];

function Logo() {
  return (
    <Link href={qp("")} className="flex items-center gap-2" aria-label="Qpids Place home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="var(--qp-coral)" />
        <path
          d="M16 23.5s-7-4.3-7-9.2A3.9 3.9 0 0 1 16 12a3.9 3.9 0 0 1 7 2.3c0 4.9-7 9.2-7 9.2z"
          fill="#fff"
        />
      </svg>
      <span className="qp-serif text-xl font-bold">Qpids Place</span>
    </Link>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  const { user, ready, signOut } = useAuth();
  const pathname = usePathname() || "";
  const router = useRouter();
  const section = pathname.replace(/^\/qpids\/?/, "").replace(/^\//, "").split("/")[0];
  const isPublic = PUBLIC.includes(section);

  useEffect(() => {
    if (ready && !user && !isPublic) router.replace(qp("login"));
  }, [ready, user, isPublic, router]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b" style={{ borderColor: "var(--qp-line)", background: "rgba(255,247,240,0.92)", backdropFilter: "blur(8px)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Logo />
          {user ? (
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
              {NAV.map((n) => (
                <Link key={n.href} href={qp(n.href)} className="qp-navlink" aria-current={section === n.href ? "page" : undefined}>
                  {n.label}
                </Link>
              ))}
              <button className="qp-navlink" onClick={() => signOut().then(() => router.push(qp("")))}>
                Sign out
              </button>
            </nav>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={qp("blog")} className="qp-navlink hidden sm:inline-block" aria-current={section === "blog" ? "page" : undefined}>
                Blog
              </Link>
              <Link href={qp("login")} className="qp-btn qp-btn-ghost py-2">
                Log in
              </Link>
              <Link href={qp("join")} className="qp-btn qp-btn-primary py-2">
                Join free
              </Link>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 lg:pb-12">
        {!SERVER_DRAWN.includes(section) && (!ready || (!user && !isPublic)) ? <p className="qp-muted py-20 text-center">Loading…</p> : children}
      </main>
      {user && (
        <nav
          className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t py-2 lg:hidden"
          style={{ borderColor: "var(--qp-line)", background: "var(--qp-surface)" }}
          aria-label="Main"
        >
          {NAV.filter((n) => !n.wideOnly).map((n) => (
            <Link key={n.href} href={qp(n.href)} className="qp-navlink qp-navlink-tight" aria-current={section === n.href ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
      )}
      <footer className={`qp-muted mx-auto max-w-5xl px-4 text-sm ${user ? "hidden pb-10 lg:block" : "pb-10"}`}>
        © {new Date().getFullYear()} Qpids Place · 18+ only · Be kind, be real. ·{" "}
        <Link href={qp("blog")} className="underline">Blog</Link> ·{" "}
        <Link href={qp("terms")} className="underline">Terms</Link> ·{" "}
        <Link href={qp("privacy")} className="underline">Privacy</Link> ·{" "}
        <Link href={qp("guidelines")} className="underline">Guidelines</Link> ·{" "}
        <Link href={qp("safety")} className="underline">Safety</Link>
      </footer>
    </>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Frame>{children}</Frame>
    </AuthProvider>
  );
}
