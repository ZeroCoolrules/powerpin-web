// app/auth/callback/page.tsx
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const dynamic = "force-dynamic"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const supabase = createRouteHandlerClient({ cookies })

  if (searchParams.code) {
    // 🔑 THIS is what you were missing
    await supabase.auth.exchangeCodeForSession(searchParams.code)
  }

  redirect("/login")
}
