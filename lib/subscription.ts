import { supabaseFromJWT } from "@/lib/supabase"

export async function getUserSubscription(jwt: string) {
  const supabase = supabaseFromJWT(jwt)

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("status", "active")
    .single()

  if (error) return null
  return data
}
