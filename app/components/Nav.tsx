"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [isLight, setIsLight] = useState(false);

  // On load: read DOM, not guesses
  useEffect(() => {
    const html = document.documentElement;
    setIsLight(() => html.classList.contains("light"));
 }, []);


  function toggleTheme() {
    const html = document.documentElement;
    const willBeLight = !html.classList.contains("light");

    html.classList.toggle("light", willBeLight);
    localStorage.setItem("theme", willBeLight ? "light" : "dark");
    setIsLight(willBeLight);
  }

  return (
    <nav className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center text-sm">
      <div className="flex gap-4">
        <NavLink href="/">Gateway</NavLink>
        <NavLink href="/dashboard">Dashboard</NavLink>
        <NavLink href="/streets">Streets</NavLink>
      </div>

      {/* Button shows what mode you will switch TO */}
      <button
        onClick={toggleTheme}
        className="px-4 py-2 border border-current hover:opacity-80 transition"
      >
        {isLight ? "🌙 Dark" : "☀ Light"}
      </button>
    </nav>
  );
}

function NavLink({ href, children }: any) {
  return (
    <a
      href={href}
      className="px-4 py-2 border border-current hover:opacity-80 transition"
    >
      {children}
    </a>
  );
}
