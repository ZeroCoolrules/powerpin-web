import { createClient } from "@supabase/supabase-js"

let admin: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
  // BUILD-SAFE: never throw during import/build
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.warn("⚠️ Supabase admin env vars missing — admin disabled")
    return null as any
  }

  if (admin) return admin

  admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  return admin
}
