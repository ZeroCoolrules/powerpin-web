import { createClient } from "@supabase/supabase-js"
import { NextRequest } from "next/server"

export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) return null

  const token = authHeader.replace("Bearer ", "")
  if (!token) return null

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  )

  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null

  return data.user
}
