-- ============================================
-- DISABLE RLS FOR PETS TABLE (TEMPORARY FIX)
-- ============================================
-- This disables RLS for pets table to allow inserts
-- Use this as a temporary solution while debugging the RLS issue

ALTER TABLE public.pets DISABLE ROW LEVEL SECURITY;
