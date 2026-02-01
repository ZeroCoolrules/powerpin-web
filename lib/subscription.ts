import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function getUserSubscription(jwt: string) {
  const supabase = getSupabaseAdmin

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("status", "active")
    .single()

  if (error) return null
  return data
}
