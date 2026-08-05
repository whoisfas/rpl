-- ============================================
-- FIX RLS POLICIES - RESOLVE INFINITE RECURSION
-- ============================================
-- This script fixes the infinite recursion error in users table RLS policies
-- by using SECURITY DEFINER functions instead of direct queries within policies

-- ============================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- ============================================

-- Drop USERS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;

-- Drop PETS policies
DROP POLICY IF EXISTS "Users can view own pets" ON public.pets;
DROP POLICY IF EXISTS "Admins can view all pets" ON public.pets;
DROP POLICY IF EXISTS "Users can insert own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can update own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can delete own pets" ON public.pets;
DROP POLICY IF EXISTS "Admins can delete all pets" ON public.pets;

-- Drop PRODUCTS policies
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Drop ORDERS policies
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

-- Drop ORDER_ITEMS policies
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert order items" ON public.order_items;

-- Drop RESERVATIONS policies
DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Admins can view all reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can insert own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can update own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can delete own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Admins can update reservations" ON public.reservations;
DROP POLICY IF EXISTS "Admins can delete reservations" ON public.reservations;

-- Drop PAYMENTS policies
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can update own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can update payments" ON public.payments;

-- ============================================
-- STEP 2: CREATE SECURITY DEFINER FUNCTIONS
-- ============================================
-- These functions bypass RLS to check user role without causing recursion

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to check if user owns a specific resource
CREATE OR REPLACE FUNCTION public.is_user_owner(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- STEP 3: CREATE NEW POLICIES (RECURSION-FREE)
-- ============================================

-- USERS POLICIES
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete users" ON public.users
    FOR DELETE USING (public.is_admin());

-- PETS POLICIES
CREATE POLICY "Users can view own pets" ON public.pets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all pets" ON public.pets
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can insert own pets" ON public.pets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets" ON public.pets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets" ON public.pets
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete all pets" ON public.pets
    FOR DELETE USING (public.is_admin());

-- PRODUCTS POLICIES (Public read, admin write)
CREATE POLICY "Public can view products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" ON public.products
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products" ON public.products
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete products" ON public.products
    FOR DELETE USING (public.is_admin());

-- ORDERS POLICIES
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can insert own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders" ON public.orders
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete orders" ON public.orders
    FOR DELETE USING (public.is_admin());

-- ORDER_ITEMS POLICIES
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all order items" ON public.order_items
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can insert order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

-- RESERVATIONS POLICIES
CREATE POLICY "Users can view own reservations" ON public.reservations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all reservations" ON public.reservations
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can insert own reservations" ON public.reservations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reservations" ON public.reservations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update reservations" ON public.reservations
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Users can delete own reservations" ON public.reservations
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete reservations" ON public.reservations
    FOR DELETE USING (public.is_admin());

-- PAYMENTS POLICIES
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can insert own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments" ON public.payments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update payments" ON public.payments
    FOR UPDATE USING (public.is_admin());

-- ============================================
-- STEP 4: GRANT EXECUTE PERMISSIONS ON FUNCTIONS
-- ============================================
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_user_owner(UUID) TO authenticated, anon;

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this to verify policies are correctly set:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, policyname;
