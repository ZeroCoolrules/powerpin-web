import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import InboxClient from "./InboxClient"
import { supabaseFromJWT } from "@/lib/supabase-server"

export default async function InboxPage() {
  const cookieStore = cookies()
  const token =
    cookieStore.get("sb-access-token")?.value ??
    cookieStore.get("supabase-auth-token")?.value

  if (!token) redirect("/login")

  const supabase = supabaseFromJWT(token)

  const { data } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("status", "active")
    .single()

  if (!data) redirect("/pricing")

  return <InboxClient />
}
