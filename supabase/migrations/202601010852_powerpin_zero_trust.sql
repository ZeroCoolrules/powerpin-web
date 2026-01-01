-- ==============================
-- POWERPIN ZERO-TRUST HARDENING
-- ==============================

-- 1. ENABLE RLS ON TARGET TABLES
ALTER TABLE public.contract ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.street_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gateway_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_timeline ENABLE ROW LEVEL SECURITY;

-- 2. DENY-ALL BASELINE POLICIES (STRICT ZERO TRUST)

-- CONTRACT
DROP POLICY IF EXISTS deny_all_contract ON public.contract;
CREATE POLICY deny_all_contract
ON public.contract
FOR ALL
TO public
USING (false);

-- CONTRACT TERMS
DROP POLICY IF EXISTS deny_all_contract_terms ON public.contract_terms;
CREATE POLICY deny_all_contract_terms
ON public.contract_terms
FOR ALL
TO public
USING (false);

-- CONTRACT PAYMENTS
DROP POLICY IF EXISTS deny_all_contract_payments ON public.contract_payments;
CREATE POLICY deny_all_contract_payments
ON public.contract_payments
FOR ALL
TO public
USING (false);

-- PAYMENTS
DROP POLICY IF EXISTS deny_all_payments ON public.payments;
CREATE POLICY deny_all_payments
ON public.payments
FOR ALL
TO public
USING (false);

-- PROFILES
DROP POLICY IF EXISTS deny_all_profiles ON public.profiles;
CREATE POLICY deny_all_profiles
ON public.profiles
FOR ALL
TO public
USING (false);

-- PRESENCE
DROP POLICY IF EXISTS deny_all_presence ON public.presence;
CREATE POLICY deny_all_presence
ON public.presence
FOR ALL
TO public
USING (false);

-- STREETS
DROP POLICY IF EXISTS deny_all_streets ON public.streets;
CREATE POLICY deny_all_streets
ON public.streets
FOR ALL
TO public
USING (false);

-- STREET SETTINGS
DROP POLICY IF EXISTS deny_all_street_settings ON public.street_settings;
CREATE POLICY deny_all_street_settings
ON public.street_settings
FOR ALL
TO public
USING (false);

-- GATEWAY PRESENCE
DROP POLICY IF EXISTS deny_all_gateway_presence ON public.gateway_presence;
CREATE POLICY deny_all_gateway_presence
ON public.gateway_presence
FOR ALL
TO public
USING (false);

-- TASK QUEUE
DROP POLICY IF EXISTS deny_all_task_queue ON public.task_queue;
CREATE POLICY deny_all_task_queue
ON public.task_queue
FOR ALL
TO public
USING (false);

-- TRUST ALERTS
DROP POLICY IF EXISTS deny_all_trust_alerts ON public.trust_alerts;
CREATE POLICY deny_all_trust_alerts
ON public.trust_alerts
FOR ALL
TO public
USING (false);

-- TRUST TIMELINE
DROP POLICY IF EXISTS deny_all_trust_timeline ON public.trust_timeline;
CREATE POLICY deny_all_trust_timeline
ON public.trust_timeline
FOR ALL
TO public
USING (false);
