export default function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-block px-3 py-1 text-xs rounded bg-neutral-800 text-neutral-300">
      {label}
    </span>
  );
}
