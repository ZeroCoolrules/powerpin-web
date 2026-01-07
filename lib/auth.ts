import { NextRequest } from "next/server"
import { supabaseFromJWT } from "@/lib/supabase"

export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }

  const jwt = authHeader.replace("Bearer ", "")
  const supabase = supabaseFromJWT(jwt)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  return {
    id: user.id,
    email: user.email,
    trust_class: user.user_metadata?.trust_class ?? "observer",
  }
}
