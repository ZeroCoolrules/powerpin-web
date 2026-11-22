import { mediaUrl } from "./lib/api";

export default function Avatar({
  name,
  photoUrl,
  emoji,
  color,
  size = 48,
}: {
  name: string;
  photoUrl?: string | null;
  emoji?: string;
  color?: string;
  size?: number;
}) {
  const src = mediaUrl(photoUrl);
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <span
      aria-label={name}
      role="img"
      className="inline-flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: color || "var(--qp-blush)", fontSize: size * 0.5 }}
    >
      {emoji || name.slice(0, 1)}
    </span>
  );
}
