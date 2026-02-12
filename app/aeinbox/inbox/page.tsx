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
      <div className="mb-8 text-center">
		<h1 className="text-3xl font-semibold tracking-wide text-cyan-400">
			Æmail
		</h1>
			<p className="text-gray-400 mt-2">
				Unlock secure, AI-powered email.
			</p>
          {/* Stripe Checkout button */}
          <InboxUpgrade />

          <div className="mt-6 text-xs opacity-60">
            Already paid? Refresh this page.
          </div>
      </div>
     )
  }

  return <InboxClient />
}
