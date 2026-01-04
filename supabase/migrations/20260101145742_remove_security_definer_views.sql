-- =========================================
-- REMOVE SECURITY DEFINER FROM PUBLIC VIEWS
-- =========================================

-- TRUST HEALTH OVERVIEW (RLS-safe, no SECURITY DEFINER)
DROP VIEW IF EXISTS public.vw_trust_health_overview;
CREATE VIEW public.vw_trust_health_overview AS
SELECT
  user_uid,
  trust_score,
  locked,
  lock_reason,
  last_activity,
  updated_at,
  last_decay_at
FROM public.trust_profiles;


-- GROW FLOW MAP (RLS-safe, no SECURITY DEFINER)
DROP VIEW IF EXISTS public.vw_grow_flow_map;
CREATE VIEW public.vw_grow_flow_map AS
SELECT
  grow_id,
  from_user_uid,
  to_user_uid,
  amount,
  unit,
  reason,
  timestamp
FROM public.grow_flow;


-- TRUST TIMELINE (DAILY) — RLS-safe
DROP VIEW IF EXISTS public.vw_trust_timeline_daily;
CREATE VIEW public.vw_trust_timeline_daily AS
SELECT
  user_uid,
  date_trunc('day', created_at) AS day,
  AVG(delta)::numeric AS avg_delta,
  SUM(delta) AS total_delta,
  COUNT(*) AS event_count
FROM public.trust_timeline
GROUP BY user_uid, day;


-- POW TRUST LEADERBOARD — RLS-safe
DROP VIEW IF EXISTS public.vw_pow_trust_leaderboard;
CREATE VIEW public.vw_pow_trust_leaderboard AS
SELECT
  p.user_uid,
  p.name,
  tp.trust_score,
  p.pow_class_id,
  pc.class_code,
  p.created_at
FROM public.pow p
JOIN public.trust_profiles tp
  ON tp.user_uid = p.user_uid
LEFT JOIN public.pow_class pc
  ON pc.pow_class_id = p.pow_class_id
ORDER BY tp.trust_score DESC;


-- PROOF INTEGRITY — RLS-safe
DROP VIEW IF EXISTS public.vw_proof_integrity;
CREATE VIEW public.vw_proof_integrity AS
SELECT
  id AS proof_id,
  user_uid,
  event_type,
  trust_score,
  event_hash,
  prev_hash,
  proof_hash,
  created_at
FROM public.trust_proof_ledger;

-- PROOF OF INTENT AUDIT — FINAL, schema-accurate, RLS-safe
DROP VIEW IF EXISTS public.proof_of_intent_audit;

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



-- GROW ECONOMICS — RLS-safe
DROP VIEW IF EXISTS public.vw_grow_economics;
CREATE VIEW public.vw_grow_economics AS
SELECT
  COUNT(*)::bigint AS total_flows,
  SUM(amount) AS total_grow,
  AVG(amount) AS avg_flow,
  MAX(timestamp) AS last_flow_at
FROM public.grow_flow;
