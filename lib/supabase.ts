import { createClient, SupabaseClient } from "@supabase/supabase-js"

/**
 * Safe env reader.
 * Only called inside functions (never at module scope).
 */
function env(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

/**
 * ─────────────────────────────────────────────
 * BROWSER CLIENT
 * Used in client components (login, inbox UI)
 * ─────────────────────────────────────────────
 */
export function getSupabaseBrowser(): SupabaseClient {
  return createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  )
}

/**
 * ─────────────────────────────────────────────
 * SERVER ADMIN CLIENT (SERVICE ROLE)
 * Server-only. NEVER import into client files.
 * ─────────────────────────────────────────────
 */
export function getSupabaseAdmin(): SupabaseClient {
  return createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("SUPABASE_SERVICE_ROLE_KEY")
  )
}

/**
 * ─────────────────────────────────────────────
 * SERVER USER CLIENT (JWT / RLS)
 * Used in server components / route handlers
 * ─────────────────────────────────────────────
 */
export function getSupabaseFromJWT(jwt: string): SupabaseClient {
  return createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    }
  )
}
