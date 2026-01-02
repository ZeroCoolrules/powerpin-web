export default function TitleBanner({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="text-neutral-400 mt-2">{subtitle}</p>}
    </header>
  );
}
