import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

serve(async (req) => {
  const { user_id } = await req.json()

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  // 1️⃣ delete auth user
  const { error: authError } =
    await supabase.auth.admin.deleteUser(user_id)

  if (authError) {
    return new Response(authError.message, { status: 400 })
  }

  // 2️⃣ clean app tables
  const { error: dbError } =
    await supabase.rpc("delete_app_user", { p_uid: user_id })

  if (dbError) {
    return new Response(dbError.message, { status: 400 })
  }

  return new Response("User fully deleted", { status: 200 })
})
