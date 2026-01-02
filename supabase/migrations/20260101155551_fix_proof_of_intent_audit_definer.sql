-- HARD RESET proof_of_intent_audit to remove SECURITY DEFINER

-- 1. Drop the view completely (no REPLACE)
DROP VIEW IF EXISTS public.proof_of_intent_audit CASCADE;

-- 2. Recreate the view explicitly WITHOUT security definer
CREATE VIEW public.proof_of_intent_audit AS
SELECT
  id        AS trust_proof_id,
  user_id   AS actor_id,
  intent_type,
  intent_score,
  intent_hash,
  metadata,
  created_at
FROM public.intent_events;

-- 3. Explicitly set ownership to postgres (belt + suspenders)
ALTER VIEW public.proof_of_intent_audit OWNER TO postgres;
