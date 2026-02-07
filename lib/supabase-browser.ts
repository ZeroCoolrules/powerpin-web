import { createClient } from "@supabase/supabase-js"

let client: ReturnType<typeof createClient> | null = null

export function supabaseBrowser() {
  if (typeof window === "undefined") {
    throw new Error("supabaseBrowser called on server")
  }

  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  return client
}
