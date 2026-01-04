import { NextRequest, NextResponse } from "next/server";
import { supabaseFromJWT, supabaseAdmin } from "@/lib/supabase";
import { canApprove } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  const jwt = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseFromJWT(jwt);
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });
  }

  const { data: roleRow } = await supabase
    .from("approval_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!canApprove(roleRow?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { artifact_id, artifact_hash, status, notes } = await req.json();

  const { error } = await supabaseAdmin
    .from("store_approvals")
    .insert({
      artifact_id,
      artifact_hash,
      approved_by: user.id,
      approver_role: roleRow.role,
      status,
      notes
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    status: "recorded",
    artifact_id
  });
}
