import { getSupabaseAdmin } from "@/lib/supabase"

export async function requestApproval(command: string, session: any) {
  const supabase = getSupabaseAdmin()

  // (future) persist approval request
  // await supabase.from("approvals").insert({ ... })

  return {
    approval_id: crypto.randomUUID(),
    status: "awaiting_human",
  }
}
