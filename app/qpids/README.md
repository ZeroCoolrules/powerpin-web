# Qpids Place

Qpids Place is our own dating site. It lives in this app under `/qpids` and
talks to the shared dating backend (the Cupid's Corner server) through
`/api/v1`. Members are one pool across brands: someone who joins here can
match and chat with someone who joined on Cupid's Corner, and the same login
works on both.

All of the code and design here is original. Nothing is taken from PG Dating
Pro.

## Pages

| Path | What it does |
|---|---|
| `/qpids` | Landing page with live member stats |
| `/qpids/join`, `/qpids/login` | Sign up (18+) and log in. `/qpids/join?ref=CODE` is an invite link: the new member gets welcome sparks, and the inviter is rewarded once that member's first photo is approved. |
| `/qpids/in/[slug]` | Launch page for one place, e.g. `/qpids/in/missouri`. Posts, flyers and QR codes point here. It shows the founding member offer and spots left (numbers come from the backend: `FOUNDING_MEMBER_LIMIT`, `FOUNDING_PREMIUM_DAYS`, `FOUNDING_SPARKS`) and links to `/qpids/join?campaign=missouri`, which records the sign-up under that place. |
| `/qpids/safety` | Safety advice and the statement that we do not run criminal background checks. The same notice (`SafetyNotice.tsx`) is on the join page and on every member profile, which Illinois law (815 ILCS 518/10) requires. Keep the statement bold, in capitals and at least 12-point. |
| `/qpids/discover` | Profile deck with match score, interest filter, "Near me" |
| `/qpids/matches` | Matches, winks you've received (with "Wink back"), and "people who like you". Premium, paid for with sparks, shows who they are. |
| `/qpids/members/[id]` | A member's full profile: answers to the profile questions, approved album photos, Wink, Report and Block. |
| `/qpids/quiz` | Compatibility questionnaire: about forty questions in nine topics on what new couples trip over (arguing, money, family, pace, daily life, affection, values, plans, trust). Each answer comes with "how much it matters". It feeds the Discover order and the "How you fit" card on a member's profile, which shows a score, a breakdown by topic and what is worth talking about early. Individual answers are never shown to other members. Admins see totals on `/qpids/admin`. |
| `/qpids/meetups` | Open meetup board. A member posts when they're free and what they'd like to do; others ask to join and the host picks who comes. The board shows only a general area. The exact place is private to the host and the people they accept. Blocks, bans and reports apply. |
| `/qpids/admin` | For backend admins (`ADMIN_USERNAMES`): the photo review queue and the list of profile questions. |
| `/qpids/chats`, `/qpids/chats/[id]` | One-to-one chats and Cupid, the AI coach |
| `/qpids/profile` | Edit profile, prompts, interests and photo. Also "More about you" (the profile questions), the photo album (each photo is reviewed before others see it), and a personal invite link. |
| `/qpids/coach` | Paid phone session with Cupid. Shows the price, takes payment in sparks, then shows the coach number and a one-time code. The number comes from the backend only after payment and is never in this repo. |
| `/qpids/sparks` | Balance and spark packs (Stripe checkout on the backend) |
| `/qpids/feed` | Member feed: post text with an optional photo, like, comment, delete, report. Shared with Cupid's Corner, with blocks and bans applied by the backend. |
| `/qpids/blog`, `/qpids/blog/[slug]` | Public blog, readable without signing in. Drawn on the server when `QPIDS_BACKEND_URL` (or an absolute `NEXT_PUBLIC_QPIDS_API_URL`) is set, so search engines and link previews see the article; otherwise it loads in the browser. Refreshes about once a minute. |
| `/qpids/blog/write`, `/qpids/blog/write/[id]` | Blog editor for backend admins (`ADMIN_USERNAMES`): drafts, cover photo, preview, publish. The same articles show on Cupid's Corner. |

## Settings

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_QPIDS_API_URL` | Base URL of the shared backend, for example the Render URL of Cupid's Corner. Defaults to `http://localhost:8787`. |
| `QPIDS_BACKEND_URL` | Optional. When set, `/api/qpids-proxy/*` on this app forwards to the backend. Use it with `NEXT_PUBLIC_QPIDS_API_URL=/api/qpids-proxy` so the browser never calls the backend directly and no CORS setup is needed. |
| `NEXT_PUBLIC_QPIDS_BRAND` | Brand slug sent as `X-Brand`. Defaults to `qpidsplace`. |
| `NEXT_PUBLIC_QPIDS_ROOT` | Where the site is mounted. Defaults to `/qpids`. Set to `/` on a deployment that serves only the Qpids Place domain. |
| `QPIDS_HOSTS` | Comma separated hostnames that should show Qpids Place at the root, for example `qpidsplace.com,www.qpidsplace.com`. Other hosts keep PowerPin unchanged. |

## One-time setup on the backend

1. Create the brand (as an admin user):
   `POST /api/v1/admin/brands` with
   `{"slug":"qpidsplace","name":"Qpids Place","domain":"<your domain>"}`.
   Setting the domain also lets the backend accept browser requests from it.
2. If the site is served from another origin (a Vercel preview, localhost),
   add that origin to `ALLOWED_ORIGINS` on the backend.

## Chat

When the backend has Stream configured, one-to-one chats use the same Stream
channels as the Cupid's Corner app (`messaging:conv-<id>`), so messages appear
on both sites in real time. Without Stream, and always for the AI coach, the
page uses the backend's messages API and checks for new messages every three
seconds.
