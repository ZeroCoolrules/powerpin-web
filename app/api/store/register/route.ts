import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: NextRequest) {
  const jwt = req.headers
    .get("authorization")
    ?.replace("Bearer ", "");

  if (!jwt) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  const supabase = getSupabaseAdmin()
  if (!supabase) {
  return NextResponse.json(
    { error: "Service unavailable" },
    { status: 503 }
  )
}

  const supabase = getSupabaseAdmin()

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Invalid user" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const {
    artifact_id,
    artifact_hash,
    trust_class,
    manifest_summary
  } = body;

  if (!artifact_id || !artifact_hash || !trust_class) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("store_artifacts")
    .insert({
      artifact_id,
      artifact_hash,
      trust_class,
      builder_id: user.id,
      status: "pending",
      manifest_summary
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: "registered",
    artifact_id
  });
}
