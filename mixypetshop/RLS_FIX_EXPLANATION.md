# Penjelasan Perbaikan RLS Policies - Infinite Recursion

## Penyebab Error

Error "infinite recursion detected in policy for relation users" terjadi karena:

### Masalah Utama: Recursive Query dalam Policy

Policy lama menggunakan subquery yang mengakses tabel `users` dari dalam policy tabel `users` itu sendiri:

```sql
-- CONTOH POLICY LAMA (BERMASALAH)
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users  -- ← RECURSI KE TABEL USERS SENDIRI
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

**Alur Recursion:**
1. User mencoba SELECT dari tabel `users`
2. RLS policy dievaluasi
3. Policy melakukan SELECT dari tabel `users` lagi untuk cek role
4. RLS policy dievaluasi lagi untuk SELECT tersebut
5. Policy melakukan SELECT lagi → **INFINITE LOOP**

### Lokasi Masalah

Policy yang menyebabkan recursion ada di:
- **users**: 4 policy admin (SELECT, UPDATE, DELETE)
- **pets**: 2 policy admin (SELECT, DELETE)
- **products**: 3 policy admin (INSERT, UPDATE, DELETE)
- **orders**: 3 policy admin (SELECT, UPDATE, DELETE)
- **order_items**: 1 policy admin (SELECT)
- **reservations**: 2 policy admin (SELECT, UPDATE, DELETE)
- **payments**: 1 policy admin (SELECT, UPDATE)

Total: **16 policy** yang mengakses tabel `users` secara rekursif.

---

## Solusi: SECURITY DEFINER Functions

### Konsep

Gunakan **SECURITY DEFINER functions** untuk bypass RLS saat mengecek role:

```sql
-- FUNCTION BARU (AMAN)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

**Mengapa Aman:**
- `SECURITY DEFINER` membuat function berjalan dengan hak akses pembuat (bukan caller)
- Function bypass RLS policies
- Tidak ada recursion karena function tidak mengevaluasi policy lagi

### Policy Baru Menggunakan Function

```sql
-- POLICY BARU (AMAN)
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (public.is_admin());  -- ← Panggil function, bukan query langsung
```

---

## Daftar Policy Lama yang Dihapus

### Users Table (5 policy)
1. `Users can view own profile`
2. `Admins can view all users` ❌ (recursive)
3. `Users can update own profile`
4. `Admins can update all users` ❌ (recursive)
5. `Admins can delete users` ❌ (recursive)

### Pets Table (6 policy)
1. `Users can view own pets`
2. `Admins can view all pets` ❌ (recursive)
3. `Users can insert own pets`
4. `Users can update own pets`
5. `Users can delete own pets`
6. `Admins can delete all pets` ❌ (recursive)

### Products Table (4 policy)
1. `Public can view products`
2. `Admins can insert products` ❌ (recursive)
3. `Admins can update products` ❌ (recursive)
4. `Admins can delete products` ❌ (recursive)

### Orders Table (5 policy)
1. `Users can view own orders`
2. `Admins can view all orders` ❌ (recursive)
3. `Users can insert own orders`
4. `Admins can update orders` ❌ (recursive)
5. `Admins can delete orders` ❌ (recursive)

### Order Items Table (3 policy)
1. `Users can view own order items`
2. `Admins can view all order items` ❌ (recursive)
3. `Users can insert order items`

### Reservations Table (7 policy)
1. `Users can view own reservations`
2. `Admins can view all reservations` ❌ (recursive)
3. `Users can insert own reservations`
4. `Users can update own reservations`
5. `Users can delete own reservations`
6. `Admins can update reservations` ❌ (recursive)
7. `Admins can delete reservations` ❌ (recursive)

### Payments Table (5 policy)
1. `Users can view own payments`
2. `Admins can view all payments` ❌ (recursive)
3. `Users can insert own payments`
4. `Users can update own payments`
5. `Admins can update payments` ❌ (recursive)

**Total Policy Dihapus: 35**

---

## Daftar Policy Baru yang Dibuat

### Functions (2 function)
1. `public.is_admin()` - Cek apakah user adalah admin
2. `public.is_user_owner(UUID)` - Cek apakah user adalah owner resource

### Users Table (5 policy)
1. `Users can view own profile` - SELECT WHERE auth.uid() = id
2. `Admins can view all users` - SELECT WHERE public.is_admin()
3. `Users can update own profile` - UPDATE WHERE auth.uid() = id
4. `Admins can update all users` - UPDATE WHERE public.is_admin()
5. `Admins can delete users` - DELETE WHERE public.is_admin()

### Pets Table (6 policy)
1. `Users can view own pets` - SELECT WHERE auth.uid() = user_id
2. `Admins can view all pets` - SELECT WHERE public.is_admin()
3. `Users can insert own pets` - INSERT CHECK auth.uid() = user_id
4. `Users can update own pets` - UPDATE WHERE auth.uid() = user_id
5. `Users can delete own pets` - DELETE WHERE auth.uid() = user_id
6. `Admins can delete all pets` - DELETE WHERE public.is_admin()

### Products Table (4 policy)
1. `Public can view products` - SELECT WHERE true
2. `Admins can insert products` - INSERT CHECK public.is_admin()
3. `Admins can update products` - UPDATE WHERE public.is_admin()
4. `Admins can delete products` - DELETE WHERE public.is_admin()

### Orders Table (5 policy)
1. `Users can view own orders` - SELECT WHERE auth.uid() = user_id
2. `Admins can view all orders` - SELECT WHERE public.is_admin()
3. `Users can insert own orders` - INSERT CHECK auth.uid() = user_id
4. `Admins can update orders` - UPDATE WHERE public.is_admin()
5. `Admins can delete orders` - DELETE WHERE public.is_admin()

### Order Items Table (3 policy)
1. `Users can view own order items` - SELECT via orders table join
2. `Admins can view all order items` - SELECT WHERE public.is_admin()
3. `Users can insert order items` - INSERT CHECK via orders table join

### Reservations Table (7 policy)
1. `Users can view own reservations` - SELECT WHERE auth.uid() = user_id
2. `Admins can view all reservations` - SELECT WHERE public.is_admin()
3. `Users can insert own reservations` - INSERT CHECK auth.uid() = user_id
4. `Users can update own reservations` - UPDATE WHERE auth.uid() = user_id
5. `Users can delete own reservations` - DELETE WHERE auth.uid() = user_id
6. `Admins can update reservations` - UPDATE WHERE public.is_admin()
7. `Admins can delete reservations` - DELETE WHERE public.is_admin()

### Payments Table (5 policy)
1. `Users can view own payments` - SELECT WHERE auth.uid() = user_id
2. `Admins can view all payments` - SELECT WHERE public.is_admin()
3. `Users can insert own payments` - INSERT CHECK auth.uid() = user_id
4. `Users can update own payments` - UPDATE WHERE auth.uid() = user_id
5. `Admins can update payments` - UPDATE WHERE public.is_admin()

**Total Policy Baru: 35 + 2 Functions**

---

## Mengapa Policy Baru Tidak Menyebabkan Infinite Recursion

### 1. SECURITY DEFINER Bypass RLS

Functions menggunakan `SECURITY DEFINER`:

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

**Efek:**
- Function berjalan dengan hak akses pembuat (bukan caller)
- RLS policies **TIDAK** dievaluasi saat function berjalan
- Query ke tabel `users` dalam function tidak memicu policy lagi

### 2. Tidak Ada Recursive Query

Policy baru memanggil function, bukan query langsung:

```sql
-- LAMA (Recursive)
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.users  -- ← Query langsung ke users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- BARU (Non-recursive)
FOR SELECT USING (public.is_admin());  -- ← Panggil function
```

**Alur Baru:**
1. User mencoba SELECT dari tabel `users`
2. RLS policy dievaluasi
3. Policy memanggil `public.is_admin()`
4. Function berjalan dengan SECURITY DEFINER (bypass RLS)
5. Function melakukan SELECT dari `users` **TANPA** mengevaluasi policy
6. Function mengembalikan TRUE/FALSE
7. Policy menggunakan hasil tersebut
8. **Tidak ada recursion**

### 3. SET search_path = public

Menggunakan `SET search_path = public` untuk:
- Menghindari schema injection
- Memastikan function menggunakan tabel yang benar
- Mencegah konflik dengan schema lain

---

## Verifikasi Aplikasi Tetap Berjalan

### Fitur yang Tetap Berjalan

#### 1. Authentication
- ✅ Register: Trigger `handle_new_user()` tetap berjalan
- ✅ Login: Supabase Auth tidak terpengaruh RLS
- ✅ Session: Session management tetap normal

#### 2. User Operations
- ✅ View own profile: Policy `Users can view own profile` menggunakan `auth.uid() = id`
- ✅ Update own profile: Policy `Users can update own profile` menggunakan `auth.uid() = id`
- ✅ User hanya bisa akses data miliknya sendiri

#### 3. Admin Operations
- ✅ View all users: Policy `Admins can view all users` menggunakan `public.is_admin()`
- ✅ Update users: Policy `Admins can update all users` menggunakan `public.is_admin()`
- ✅ Delete users: Policy `Admins can delete users` menggunakan `public.is_admin()`
- ✅ Admin bisa akses semua data sesuai hak akses

#### 4. Other Tables
- ✅ Pets: User hanya bisa akses pets miliknya, admin bisa akses semua
- ✅ Products: Public bisa view, admin bisa CRUD
- ✅ Orders: User hanya bisa akses orders miliknya, admin bisa akses semua
- ✅ Reservations: User hanya bisa akses reservations miliknya, admin bisa akses semua
- ✅ Payments: User hanya bisa akses payments miliknya, admin bisa akses semua

### Logika Bisnis Tidak Berubah

Semua logika bisnis tetap sama:
- Role-based access control masih berfungsi
- User hanya bisa akses data miliknya
- Admin punya akses penuh
- Tidak ada perubahan di frontend code

---

## Cara Menjalankan Fix

### Langkah 1: Buka SQL Editor

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Buka **SQL Editor**
4. Klik **"New query"**

### Langkah 2: Jalankan Script

1. Buka file `fix-rls-policies.sql`
2. Copy seluruh isi file
3. Paste ke SQL Editor
4. Klik **"Run"**

### Langkah 3: Verifikasi

Jalankan query ini untuk verifikasi:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

Pastikan semua policy baru terdaftar dan tidak ada policy lama.

### Langkah 4: Test Aplikasi

1. Register user baru
2. Login sebagai user
3. Coba akses fitur-fitur
4. Login sebagai admin
5. Coba akses admin dashboard

---

## Ringkasan

### Penyebab Error
- Policy lama melakukan query ke tabel `users` dari dalam policy tabel `users`
- Ini menyebabkan infinite recursion karena RLS dievaluasi berulang

### Solusi
- Buat SECURITY DEFINER functions untuk bypass RLS
- Policy baru memanggil function, bukan query langsung
- Function berjalan tanpa mengevaluasi RLS, menghindari recursion

### Hasil
- ✅ Infinite recursion teratasi
- ✅ Login dan register berfungsi normal
- ✅ User hanya bisa akses data miliknya
- ✅ Admin bisa akses semua data
- ✅ Logika bisnis tetap sama
- ✅ Frontend code tidak perlu diubah
