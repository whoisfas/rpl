-- ============================================
-- FIX PETS TABLE RLS POLICY
-- ============================================
-- This script fixes the INSERT policy for pets table

-- Drop existing INSERT policy for pets
DROP POLICY IF EXISTS "Users can insert own pets" ON public.pets;

-- Create new INSERT policy with simpler check
CREATE POLICY "Users can insert own pets" ON public.pets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Verify the policy
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'pets' AND cmd = 'INSERT';
