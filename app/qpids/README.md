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
| `/qpids/join`, `/qpids/login` | Sign up (18+) and log in |
| `/qpids/discover` | Profile deck with match score, interest filter, "Near me" |
| `/qpids/matches` | Matches and "people who like you" |
| `/qpids/chats`, `/qpids/chats/[id]` | One-to-one chats and Cupid, the AI coach |
| `/qpids/profile` | Edit profile, prompts, interests and photo |

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
