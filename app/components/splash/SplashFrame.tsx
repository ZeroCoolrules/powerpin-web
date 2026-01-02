export default function SplashFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-4xl p-8 border border-neutral-800 rounded-xl">
        {children}
      </div>
    </main>
  );
}
