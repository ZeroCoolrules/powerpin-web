import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import InboxClient from "./InboxClient"
import InboxUpgrade from "./InboxUpgrade"

export const dynamic = "force-dynamic"

export default async function InboxPage() {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user) {
    redirect("/login")
  }

  const user_id = session.user.id

  // Gate using profiles (what your webhook updates)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("subscription_status, plan")
    .eq("user_id", user_id)
    .single()

  const isActive =
    !profileError &&
    profile?.subscription_status === "active" &&
    profile?.plan &&
    profile.plan !== "free"

  if (!isActive) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-8">
        <div className="w-full max-w-md border border-green-700/60 bg-black/40 p-8 text-center">
          <h1 className="text-lg mb-2 tracking-wide">Æmail</h1>
          <p className="opacity-70 mb-6">
            Unlock secure, AI-powered email.
          </p>

          {/* Stripe Checkout button */}
          <InboxUpgrade />

          <div className="mt-6 text-xs opacity-60">
            Already paid? Refresh this page.
          </div>
        </div>
      </div>
    )
  }

  return <InboxClient />
}
