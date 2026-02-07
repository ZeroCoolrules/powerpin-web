import { createClient } from "@supabase/supabase-js"

export function getSupabaseBrowser() {
  if (typeof window === "undefined") {
    throw new Error("Supabase browser client called on server")
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Supabase env vars missing")
  }

  return createClient(url, key)
}
