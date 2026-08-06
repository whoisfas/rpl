# Manual Tasks - Supabase Dashboard

Berikut adalah langkah-langkah manual yang perlu dilakukan di Supabase Dashboard untuk menyelesaikan konfigurasi aplikasi.

---

## Task 1: Fix Users RLS Policy for Profile Update

**Masalah:** User tidak bisa update profil sendiri karena RLS policy memblokir akses.

**Langkah-langkah:**

1. Buka Supabase Dashboard
2. Masuk ke menu **SQL Editor**
3. Jalankan query berikut:

```sql
-- Disable RLS for users table (sederhana dan cepat)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Atau jika ingin menggunakan RLS dengan policy yang benar:
-- Pertama, hapus policy yang ada
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy untuk melihat data sendiri
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid()::text = id);

-- Policy untuk update data sendiri
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

-- Policy untuk admin bisa melihat semua
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()::text AND role = 'admin'
  )
);

-- Policy untuk admin bisa update semua
CREATE POLICY "Admins can update all users"
ON users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()::text AND role = 'admin'
  )
);
```

**Rekomendasi:** Gunakan opsi pertama (DISABLE RLS) untuk simplicity, atau opsi kedua jika ingin security yang lebih strict.

---

## Task 2: Add Method Column to Payments Table

**Masalah:** Kolom `method` belum ada di tabel `payments` untuk menyimpan metode pembayaran (Bank BCA/QRIS).

**Langkah-langkah:**

1. Buka Supabase Dashboard
2. Masuk ke menu **SQL Editor**
3. Jalankan query berikut:

```sql
-- Add method column to payments table
ALTER TABLE payments 
ADD COLUMN method VARCHAR(50) DEFAULT 'bca';

-- Update existing records to have a default method
UPDATE payments 
SET method = 'bca' 
WHERE method IS NULL;

-- Optional: Add constraint to only allow specific payment methods
ALTER TABLE payments 
ADD CONSTRAINT check_payment_method 
CHECK (method IN ('bca', 'qris'));
```

**Catatan:**
- `method` akan menyimpan: 'bca' atau 'qris'
- Default value adalah 'bca' untuk existing records
- Constraint memastikan hanya 2 metode yang valid

---

## Task 3: Set User Role to Admin

**Masalah:** User yang login belum memiliki role 'admin' untuk mengakses halaman admin.

**Langkah-langkah:**

### Option A: Update via SQL Editor (Recommended)

1. Buka Supabase Dashboard
2. Masuk ke menu **SQL Editor**
3. Jalankan query berikut:

```sql
-- Cari user yang ingin dijadikan admin (ganti email dengan email user Anda)
SELECT id, email, role FROM users WHERE email = 'your-email@example.com';

-- Update role menjadi admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verifikasi update
SELECT id, email, role FROM users WHERE email = 'your-email@example.com';
```

### Option B: Update via Table Editor

1. Buka Supabase Dashboard
2. Masuk ke menu **Table Editor**
3. Pilih tabel `users`
4. Cari baris user yang ingin dijadikan admin
5. Klik pada kolom `role`
6. Ubah dari 'customer' menjadi 'admin'
7. Klik **Save**

### Option C: Update via Supabase Auth

Jika menggunakan Supabase Auth dengan `auth.users`:

```sql
-- Update user_metadata di auth.users
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'your-email@example.com';

-- Pastikan juga update di public.users
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

**Catatan:**
- Ganti `your-email@example.com` dengan email user yang ingin dijadikan admin
- Setelah update, logout dan login kembali untuk mendapatkan role baru

---

## Verifikasi

Setelah menyelesaikan semua task di atas, lakukan verifikasi:

1. **Test Profile Update:**
   - Login sebagai user biasa
   - Masuk ke halaman Profile
   - Coba update nama/email/telepon
   - Harus berhasil tanpa error

2. **Test Payment Method:**
   - Buat order baru
   - Pilih metode pembayaran (BCA atau QRIS)
   - Upload bukti pembayaran
   - Cek di admin payments - method harus tersimpan

3. **Test Admin Access:**
   - Login sebagai user dengan role admin
   - Coba akses halaman `/admin/dashboard`
   - Harus bisa mengakses semua halaman admin

---

## Troubleshooting

### Jika profile update masih gagal:
- Pastikan RLS sudah di-disable atau policy sudah benar
- Cek console untuk error message
- Pastikan user.id di database sesuai dengan auth.uid()

### Jika payment method tidak tersimpan:
- Cek apakah kolom `method` sudah ada di tabel payments
- Cek apakah constraint menghalangi insert
- Cek console untuk error message

### Jika admin access masih ditolak:
- Pastikan role di tabel users sudah 'admin'
- Logout dan login kembali
- Cek AuthContext untuk logika isAdmin

---

## Checklist

- [ ] Task 1: Fix Users RLS Policy
- [ ] Task 2: Add Method Column to Payments
- [ ] Task 3: Set User Role to Admin
- [ ] Verifikasi Profile Update
- [ ] Verifikasi Payment Method
- [ ] Verifikasi Admin Access
