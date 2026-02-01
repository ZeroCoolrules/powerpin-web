// lib/supabase.server.ts
import "server-only"
import { createClient } from "@supabase/supabase-js"

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`❌ Missing env var: ${name}`)
    return ""
  }
  return value
}

export function supabaseFromJWT(jwt: string) {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL")
  const anon = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

  if (!url || !anon) {
    throw new Error("Supabase env vars missing on server")
  }

  return createClient(url, anon, {
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  })
}
