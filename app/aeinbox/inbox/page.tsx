import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import InboxClient from "./InboxClient"
import InboxUpgrade from "./InboxUpgrade"

export const dynamic = "force-dynamic"

export default async function InboxPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) redirect("/login")

  const user_id = session.user.id

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, plan, username, email")
    .eq("user_id", user_id)
    .maybeSingle()

 
  const isActive = profile?.subscription_status === "active" && profile?.plan === "aeinbox_pro"

  if (!isActive) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-lg text-center">
          <h1 className="text-3xl font-semibold text-cyan-400">Æmail</h1>
          <p className="text-gray-400 mt-2">Unlock secure, AI-powered email.</p>

          <div className="mt-10">
            <InboxUpgrade />
          </div>

          <div className="mt-6 text-xs text-gray-500">
            If you just paid, refresh once — your access flips within seconds.
          </div>
        </div>
      </div>
    )
  }

  return <InboxClient />
}
