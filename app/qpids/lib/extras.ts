// Shapes for profile fields, photo albums, winks, invites and meetups.
import type { Member } from "./api";

export type FieldDef = {
  key: string;
  label: string;
  type: "select" | "text" | "number";
  options: string[] | { min: number; max: number } | null;
  sort: number;
  active: boolean;
};

export type AlbumPhoto = {
  id: number;
  url: string | null;
  caption: string;
  createdAt: string;
  status?: "pending" | "approved" | "rejected";
  rejectReason?: string | null;
};

export type ProfileExtras = {
  fields: { key: string; label: string; value: string }[];
  photos: AlbumPhoto[];
  wink: { canWink: boolean; winkedToday: boolean };
};

export type WinkRow = { user: Member; at: string; times: number; isNew: boolean; winkedBackToday: boolean };

export type Winks = {
  winks: WinkRow[];
  allowance: { limit: number; used: number; left: number; premium: boolean };
  limits: { free: number; premium: number };
  premium: { cost: number; days: number };
};

export type Referral = { code: string; joined: number; rewarded: number; sparksEarned: number; reward: number; welcome: number };

export type MeetupRequest = { id: number; user: Member; note: string; status: "pending" | "accepted" | "declined"; askedAt: string };

export type Meetup = {
  id: number;
  title: string;
  details: string;
  city: string;
  area: string;
  startsAt: string;
  endsAt: string;
  spots: number;
  spotsLeft: number;
  cancelled: boolean;
  isHost: boolean;
  host: Member | null;
  myRequest: "pending" | "accepted" | "declined" | "withdrawn" | null;
  place: string | null;
  hasPlace: boolean;
  pending?: number;
  requests?: MeetupRequest[];
};

// "Sat, Nov 28, 2:00 PM to 4:00 PM" in the reader's own time zone.
export function timeRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const day: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };
  const time: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  const sameDay = start.toDateString() === end.toDateString();
  const from = `${start.toLocaleDateString([], day)}, ${start.toLocaleTimeString([], time)}`;
  const to = sameDay ? end.toLocaleTimeString([], time) : `${end.toLocaleDateString([], day)}, ${end.toLocaleTimeString([], time)}`;
  return `${from} to ${to}`;
}
