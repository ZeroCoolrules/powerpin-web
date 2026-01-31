import { redirect } from "next/navigation"
import { getSupabaseServer } from "@/lib/supabase-server"
import InboxClient from "./InboxClient"

export default async function InboxPage() {
  const supabase = getSupabaseServer()

  // 1️⃣ Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 2️⃣ Subscription check
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle()

  const isSubscribed = !!sub

  // 3️⃣ Gate
  if (!isSubscribed) {
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
