// lib/supabase.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js"

/**
 * Read env vars lazily.
 * IMPORTANT: Nothing in this file may execute at import time
 * that depends on process.env being present.
 */
function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is required`)
  }
  return value
}

/**
 * ─────────────────────────────────────────────
 * ADMIN CLIENT (SERVICE ROLE)
 * Server-only. NEVER created at module scope.
 * ─────────────────────────────────────────────
 */
export function getSupabaseAdmin(): SupabaseClient {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY")
  )
}

/**
 * ─────────────────────────────────────────────
 * USER-SCOPED CLIENT (JWT / RLS)
 * Created per-request.
 * ─────────────────────────────────────────────
 */
export function supabaseFromJWT(jwt: string): SupabaseClient {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    }
  )
}
