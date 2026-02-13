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

  if (!session?.user) {
    redirect("/login")
  }

  const user_id = session.user.id

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, plan")
    .eq("user_id", user_id)
    .single()

  const isActive =
    profile?.subscription_status === "active" &&
    profile?.plan === "aeinbox_pro"

  if (!isActive) {
    return (
      <div className="text-center mt-16">
        <h1 className="text-3xl text-cyan-400 font-semibold">AEmail</h1>
        <p className="text-gray-400 mt-2">
          Unlock secure, AI-powered email.
        </p>
        <InboxUpgrade />
      </div>
    )
  }

  return <InboxClient />
}
