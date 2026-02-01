import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import InboxClient from "./InboxClient"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export default async function InboxPage() {
  const cookieStore = cookies()

  const accessToken =
    cookieStore.get("sb-access-token")?.value ??
    cookieStore.get("supabase-auth-token")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const supabase = getSupabaseAdmin()

  // 1️⃣ Verify session
  const { data: userData, error: userError } =
    await supabase.auth.getUser()

  if (userError || !userData.user) {
    redirect("/login")
  }

  // 2️⃣ Subscription check
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("status", "active")
    .single()

  // 3️⃣ Gate
  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono">
        <div className="border border-green-700 p-8 text-center">
          <h1 className="text-lg mb-2">ÆInbox</h1>
          <p className="opacity-70 mb-6">
            Unlock secure, AI-powered email.
          </p>
          <a
            href="/pricing"
            className="border border-green-600 px-6 py-2 hover:bg-green-900"
          >
            Upgrade
          </a>
        </div>
      </div>
    )
  }

  // 4️⃣ Allowed in
  return <InboxClient />
}
