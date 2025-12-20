export default function Nav() {
  return (
    <nav className="fixed top-6 left-6 z-50 flex gap-4 text-sm">
      <NavLink href="/">Gateway</NavLink>
      <NavLink href="/dashboard">Dashboard</NavLink>
      <NavLink href="/streets">Streets</NavLink>
      <NavLink href="/endless">Endless</NavLink>
      <NavLink href="/time">Time</NavLink>
    </nav>
  );
}

function NavLink({ href, children }: any) {
  return (
    <a
      href={href}
      className="px-4 py-2 border border-green-400 text-green-400
                 hover:bg-green-400 hover:text-black
                 transition-all duration-200"
    >
      {children}
    </a>
  );
}
