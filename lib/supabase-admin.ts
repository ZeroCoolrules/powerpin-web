import { createClient } from "@supabase/supabase-js"

let admin: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
  if (admin) return admin

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL missing")
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY missing")
  }

  admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  return admin
}
