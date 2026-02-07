import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import InboxClient from "./InboxClient"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export default async function InboxPage() {
  const supabase = createRouteHandlerClient({ cookies })

  // 1️⃣ Verify session (CORRECT)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect("/login")
  }

  const user_id = session.user.id

  // 2️⃣ Subscription check (USER-SCOPED)
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", user_id)
    .eq("status", "active")
    .single()

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

  // 3️⃣ Allowed in
  return <InboxClient />
}
