import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const dynamic = "force-dynamic"

export default async function AuthCallbackPage() {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If session exists, user is verified & logged in
  if (session) {
    redirect("/login")
  }

  // If something failed, send to login anyway
  redirect("/login")
}
