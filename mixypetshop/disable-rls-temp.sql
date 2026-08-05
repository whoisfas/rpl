-- ============================================
-- DISABLE RLS FOR PETS AND RESERVATIONS (TEMPORARY)
-- ============================================
-- This disables RLS temporarily to allow inserts

-- Disable RLS for pets
ALTER TABLE public.pets DISABLE ROW LEVEL SECURITY;

-- Disable RLS for reservations
ALTER TABLE public.reservations DISABLE ROW LEVEL SECURITY;

-- Verify RLS status
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname IN ('pets', 'reservations');
