// Qpids Place talks to the shared dating backend (Cupid's Corner server)
// through its versioned API. Members are one pool across every brand; the
// X-Brand header only records that someone joined through Qpids Place.

export const API_BASE = (process.env.NEXT_PUBLIC_QPIDS_API_URL || "http://localhost:8787").replace(/\/$/, "");
export const BRAND = process.env.NEXT_PUBLIC_QPIDS_BRAND || "qpidsplace";
const TOKEN_KEY = "qpids_token";

export function getToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode: stay signed in for this tab only */
  }
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Options = { method?: string; body?: unknown; form?: FormData };

export async function api<T = any>(path: string, { method = "GET", body, form }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { "x-brand": BRAND };
  const token = getToken();
  if (token) headers.authorization = `Bearer ${token}`;
  if (body !== undefined) headers["content-type"] = "application/json";
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/v1${path}`, {
      method,
      headers,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError("Can't reach Qpids Place right now. Check your connection and try again.", 0);
  }
  const text = await res.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }
  if (!res.ok) throw new ApiError(data?.error || `Something went wrong (${res.status})`, res.status);
  return data as T;
}

// Photos are served by the backend at /uploads/...
export function mediaUrl(path?: string | null): string | null {
  if (!path) return null;
  return /^https?:\/\//.test(path) ? path : `${API_BASE}${path}`;
}

export type Member = {
  id: number;
  displayName: string;
  age: number;
  gender: string;
  orientation: string;
  bio: string;
  city: string;
  avatarEmoji: string;
  avatarColor: string;
  photoUrl: string | null;
  interests: string[];
  prompts: { question: string; answer: string }[];
  sparks?: number;
  isPremium?: boolean;
  isVerified?: boolean;
  lastSeenAt?: string | null;
  match?: { percent: number; reasons: string[]; quizPercent?: number | null };
};

export type Conversation = {
  id: number;
  type: "dm" | "group" | "room" | "ai";
  title: string;
  emoji: string;
  color: string;
  photoUrl: string | null;
  members: { id: number; displayName: string; photoUrl: string | null }[];
  lastMessage?: { body: string; createdAt: string } | null;
};
