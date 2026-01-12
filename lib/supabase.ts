// lib/supabase.ts
import { createClient } from "@supabase/supabase-js"

// ─────────────────────────────────────────────
// Server-side admin client (SERVICE ROLE)
// Use ONLY in API routes / server code
// ─────────────────────────────────────────────
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─────────────────────────────────────────────
// User-scoped client using JWT
// Use when you need RLS + auth.uid()
// ─────────────────────────────────────────────
export function supabaseFromJWT(jwt: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    }
  )
}
