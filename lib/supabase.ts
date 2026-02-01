// lib/supabase.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js"

/**
 * Browser-safe env reader
 * Never throws — prevents silent prod failures
 */
function env(name: string): string {
  const value =
    typeof process !== "undefined"
      ? process.env[name]
      : (globalThis as any)?.[name]

  if (!value) {
    console.error(`❌ Missing env var in browser: ${name}`)
    return ""
  }

  return value
}

/**
 * ✅ BROWSER CLIENT
 * Used in login, register, inbox UI
 */
export function getSupabaseBrowser(): SupabaseClient {
  const url = env("NEXT_PUBLIC_SUPABASE_URL")
  const anon = env("NEXT_PUBLIC_SUPABASE_ANON_KEY")

  if (!url || !anon) {
    // DO NOT throw — allow UI to surface error
    console.error("❌ Supabase browser client not configured")
  }

  return createClient(url, anon)
}
