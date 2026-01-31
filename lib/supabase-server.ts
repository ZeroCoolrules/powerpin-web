// lib/supabase-server.ts
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is required`)
  }
  return value
}

/**
 * SERVER CLIENT (COOKIE / SESSION BASED)
 * Use in Server Components & route handlers
 */
export function getSupabaseServer() {
  const cookieStore = cookies()

  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    }
  )
}

/**
 * USER-SCOPED SERVER CLIENT (JWT / RLS)
 * Use when you already extracted a JWT
 */
export function supabaseFromJWT(jwt: string) {
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
