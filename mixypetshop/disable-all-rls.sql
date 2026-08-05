-- ============================================
-- DISABLE RLS FOR ALL TABLES (TEMPORARY FIX)
-- ============================================
-- This disables RLS for all tables to allow all operations

-- Disable RLS for pets
ALTER TABLE public.pets DISABLE ROW LEVEL SECURITY;

-- Disable RLS for products
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Disable RLS for reservations
ALTER TABLE public.reservations DISABLE ROW LEVEL SECURITY;

-- Disable RLS for orders
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Disable RLS for order_items
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- Verify RLS status
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname IN ('pets', 'products', 'reservations', 'orders', 'order_items');
