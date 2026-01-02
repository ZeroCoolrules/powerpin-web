-- --------------------------------------------
-- REMOVE SECURITY DEFINER VIEWS (FINAL CLEANUP)
-- --------------------------------------------

-- Drop old SECURITY DEFINER views
DROP VIEW IF EXISTS public.vw_proof_integrity CASCADE;
DROP VIEW IF EXISTS public.vw_grow_flow_map CASCADE;
DROP VIEW IF EXISTS public.vw_pow_trust_leaderboard CASCADE;
DROP VIEW IF EXISTS public.proof_of_intent_audit CASCADE;
DROP VIEW IF EXISTS public.vw_trust_timeline_daily CASCADE;
DROP VIEW IF EXISTS public.vw_trust_health_overview CASCADE;
DROP VIEW IF EXISTS public.vw_grow_economics CASCADE;

-- --------------------------------------------
-- RECREATE VIEWS (RLS-SAFE, NO DEFINER)
-- --------------------------------------------

-- Example: proof_of_intent_audit (already fixed earlier)
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

-- NOTE:
-- If you want the other views back, recreate them
-- WITHOUT `SECURITY DEFINER`
-- OR leave them deleted if not currently used.

-- --------------------------------------------
-- ENABLE RLS ON GHOSTPOOL MIRROR EVENTS
-- --------------------------------------------

ALTER TABLE public.ghostpool_mirror_events ENABLE ROW LEVEL SECURITY;

-- Default deny-all (safe baseline)
DROP POLICY IF EXISTS deny_all_ghostpool_mirror_events
  ON public.ghostpool_mirror_events;

CREATE POLICY deny_all_ghostpool_mirror_events
  ON public.ghostpool_mirror_events
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);
