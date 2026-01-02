import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const body = await req.json();
  const { user_id, intent_type, intent_score, metadata } = body;

  if (!user_id || !intent_type || intent_score === undefined) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400 }
    );
  }

  const { data, error } = await supabase.rpc("process_intent_atomic", {
    p_user_id: user_id,
    p_intent_type: intent_type,
    p_intent_score: intent_score,
    p_metadata: metadata ?? {}
  });

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    status: 200
  });
};
