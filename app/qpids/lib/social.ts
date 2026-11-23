// Types for the feed and the blog, plus the server-side blog fetch that lets
// search engines and link previews see articles without running the app.

export type Author = {
  id: number;
  displayName: string;
  avatarEmoji: string;
  avatarColor: string;
  photoUrl: string | null;
  isVerified: boolean;
};

export type FeedPost = {
  id: number;
  body: string;
  photoUrl: string | null;
  createdAt: string;
  author: Author;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  mine: boolean;
  canDelete: boolean;
};

export type FeedComment = { id: number; body: string; createdAt: string; author: Author; canDelete: boolean };

export type BlogSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  publishedAt: string | null;
  authorName: string;
};

export type BlogArticle = BlogSummary & { body: string; status: "draft" | "published"; updatedAt: string };

// The backend's own address, usable from the server (the browser may only
// know the relative /api/qpids-proxy path).
export function backendOrigin(): string | null {
  const direct = (process.env.QPIDS_BACKEND_URL || "").replace(/\/$/, "");
  if (direct) return direct;
  const pub = (process.env.NEXT_PUBLIC_QPIDS_API_URL || "").replace(/\/$/, "");
  return /^https?:\/\//.test(pub) ? pub : null;
}

// Returns null when the backend can't be reached; the page then loads the
// same data in the browser instead.
export async function fetchBlog<T>(path: string): Promise<T | null | "missing"> {
  const origin = backendOrigin();
  if (!origin) return null;
  try {
    const res = await fetch(`${origin}/api/v1${path}`, {
      headers: { "x-brand": process.env.NEXT_PUBLIC_QPIDS_BRAND || "qpidsplace" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (res.status === 404) return "missing";
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
