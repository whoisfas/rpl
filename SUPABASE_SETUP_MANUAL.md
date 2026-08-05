# Tutorial Setup Manual Supabase

Panduan langkah demi langkah untuk setup Supabase secara manual untuk Mixy Pet Shop.

---

## Langkah 1: Membuat Akun dan Project Supabase

### 1.1 Buat Akun Supabase

1. Buka [https://supabase.com](https://supabase.com)
2. Klik **"Start your project"**
3. Pilih sign up dengan:
   - **GitHub** (rekomendasi)
   - atau **Google**

### 1.2 Buat Project Baru

1. Setelah login, klik **"New Project"**
2. Isi form berikut:

| Field | Isi |
|-------|-----|
| **Name** | Mixy Pet Shop |
| **Database Password** | Buat password kuat (simpan dengan aman!) |
| **Region** | Singapore (pilih yang terdekat) |

3. Klik **"Create new project"**
4. Tunggu 1-2 menit hingga project siap (ada progress bar)

### 1.3 Salin Credentials

Setelah project siap:

1. Di menu kiri, klik **Settings** → **API**
2. Salin dua nilai berikut:

```
Project URL: https://xxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Simpan kedua nilai ini** untuk langkah berikutnya.

---

## Langkah 2: Setup Environment Variables

### 2.1 Buka File .env

Di folder `frontend`, buka file `.env` (atau buat baru jika belum ada):

```bash
cd /Users/muhfasyaalghoniyyu/Documents/rpl/frontend
nano .env
# atau gunakan text editor favorit Anda
```

### 2.2 Isi dengan Credentials

Paste nilai yang disalin dari langkah 1.3:

```env
VITE_SUPABASE_URL=https://xxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Ganti `https://xxxxxxxxx.supabase.co` dengan Project URL Anda
Ganti `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` dengan anon key Anda

### 2.3 Simpan File

Simpan file `.env` dan tutup editor.

---

## Langkah 3: Membuat Tabel Database

### 3.1 Buka SQL Editor

1. Di dashboard Supabase, di menu kiri, klik **SQL Editor**
2. Klik **"New query"**

### 3.2 Jalankan Schema SQL

1. Buka file `supabase-schema.sql` dari folder frontend
2. **Copy seluruh isi file** (Ctrl+A, Ctrl+C)
3. Paste ke SQL Editor di Supabase (Ctrl+V)
4. Klik tombol **"Run"** di pojok kanan bawah

### 3.3 Verifikasi Tabel

Setelah SQL selesai dijalankan:

1. Di menu kiri, klik **Table Editor**
2. Pastikan tabel-tabel berikut ada:
   - ✅ `users`
   - ✅ `pets`
   - ✅ `products`
   - ✅ `orders`
   - ✅ `order_items`
   - ✅ `reservations`
   - ✅ `payments`

Jika semua tabel ada, lanjut ke langkah 4.

---

## Langkah 4: Membuat Storage Buckets

### 4.1 Buka Storage

1. Di menu kiri, klik **Storage**

### 4.2 Buat Bucket "products"

1. Klik **"Create a new bucket"**
2. Isi form:

| Field | Isi |
|-------|-----|
| **Name** | products |
| **Public bucket** | ✅ Centang |
| **File size limit** | 5MB |
| **Allowed MIME types** | image/* |

3. Klik **"Create bucket"**

### 4.3 Buat Bucket "pets"

1. Klik lagi **"Create a new bucket"**
2. Isi form:

| Field | Isi |
|-------|-----|
| **Name** | pets |
| **Public bucket** | ✅ Centang |
| **File size limit** | 5MB |
| **Allowed MIME types** | image/* |

3. Klik **"Create bucket"**

### 4.4 Buat Bucket "payments"

1. Klik lagi **"Create a new bucket"**
2. Isi form:

| Field | Isi |
|-------|-----|
| **Name** | payments |
| **Public bucket** | ✅ Centang |
| **File size limit** | 5MB |
| **Allowed MIME types** | image/* |

3. Klik **"Create bucket"**

### 4.5 Buat Folder di Dalam Bucket (Opsional)

Untuk organisasi file yang lebih baik:

**Di bucket "products":**
1. Klik bucket `products`
2. Klik **"Create folder"**
3. Name: `products`
4. Klik **"Create folder"**

**Di bucket "pets":**
1. Klik bucket `pets`
2. Klik **"Create folder"**
3. Name: `pets`
4. Klik **"Create folder"**

**Di bucket "payments":**
1. Klik bucket `payments`
2. Klik **"Create folder"**
3. Name: `proofs`
4. Klik **"Create folder"**

---

## Langkah 5: Setup Admin User

### 5.1 Register User Biasa

1. Jalankan aplikasi React:

```bash
cd /Users/muhfasyaalghoniyyu/Documents/rpl/frontend
npm run dev
```

2. Buka browser ke `http://localhost:5173`
3. Klik **"Daftar"**
4. Isi form register:
   - **Nama Lengkap**: Admin Mixy
   - **Email**: admin@mixypetshop.com (atau email Anda)
   - **Password**: Buat password
   - **Nomor Telepon**: (opsional)
   - **Alamat**: (opsional)
5. Klik **"Daftar"**
6. Akan di-redirect ke halaman login
7. Login dengan email dan password yang baru dibuat

### 5.2 Set Role ke Admin

Ada dua cara:

**Cara A: Melalui SQL Editor (Lebih Cepat)**

1. Di Supabase dashboard, buka **SQL Editor**
2. Klik **"New query"**
3. Jalankan SQL berikut (ganti email dengan email Anda):

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@mixypetshop.com';
```

4. Klik **"Run"**

**Cara B: Melalui Table Editor**

1. Di Supabase dashboard, buka **Table Editor**
2. Klik tabel `users`
3. Cari user yang baru Anda register
4. Klik icon **edit** (pencil) di baris user tersebut
5. Ubah kolom `role` dari `customer` menjadi `admin`
6. Klik **"Save"**

### 5.3 Verifikasi Admin Access

1. Logout dari aplikasi (klik logout di navbar)
2. Login kembali dengan email admin
3. Di browser, coba akses: `http://localhost:5173/admin`
4. Seharusnya bisa masuk ke dashboard admin

Jika berhasil, setup admin selesai!

---

## Langkah 6: Test Aplikasi

### 6.1 Test sebagai Admin

1. Login sebagai admin
2. Buka **Dashboard Admin**
3. Coba tambah produk baru:
   - Klik **"Tambah Produk"**
   - Isi form produk
   - Klik **"Simpan"**
4. Verifikasi produk muncul di list

### 6.2 Test sebagai User Biasa

1. Register user baru (bukan admin)
2. Login sebagai user baru
3. Coba fitur-fitur:
   - Lihat produk di halaman Produk
   - Tambah produk ke keranjang
   - Buat reservasi
   - Lihat profil

### 6.3 Test CRUD Operations

**Admin:**
- ✅ Create: Tambah produk baru
- ✅ Read: Lihat semua produk
- ✅ Update: Edit produk yang ada
- ✅ Delete: Hapus produk

**User:**
- ✅ Create: Tambah hewan peliharaan
- ✅ Read: Lihat hewan peliharaan
- ✅ Update: Edit hewan peliharaan
- ✅ Delete: Hapus hewan peliharaan

---

## Troubleshooting

### Error: "Invalid API Key"

**Masalah:** Credentials di `.env` salah

**Solusi:**
1. Cek file `.env` di folder frontend
2. Pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` benar
3. Restart dev server: `npm run dev`

### Error: "Relation does not exist"

**Masalah:** Tabel belum dibuat

**Solusi:**
1. Buka SQL Editor di Supabase
2. Jalankan ulang schema dari `supabase-schema.sql`
3. Verifikasi di Table Editor

### Error: "Permission denied"

**Masalah:** RLS policies memblokir akses

**Solusi:**
1. Pastikan user sudah login
2. Cek role user di tabel `users`
3. Jika masih error, jalankan SQL ini untuk bypass sementara:

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);
```

### Error: "Storage bucket not found"

**Masalah:** Bucket belum dibuat

**Solusi:**
1. Buka Storage di Supabase
2. Buat bucket yang hilang (products, pets, payments)
3. Pastikan nama bucket sesuai dengan yang ada di code

### Halaman Admin Tidak Bisa Diakses

**Masalah:** User belum di-set sebagai admin

**Solusi:**
1. Buka Table Editor di Supabase
2. Buka tabel `users`
3. Cari email user Anda
4. Edit kolom `role` menjadi `admin`
5. Logout dan login kembali

---

## Checklist Setup

Sebelum menganggap setup selesai, pastikan:

- [ ] Akun Supabase sudah dibuat
- [ ] Project Supabase sudah dibuat
- [ ] `.env` sudah diisi dengan credentials
- [ ] SQL schema sudah dijalankan
- [ ] Semua tabel sudah ada di Table Editor
- [ ] Storage buckets sudah dibuat (products, pets, payments)
- [ ] Admin user sudah di-setup
- [ ] Login sebagai admin berhasil
- [ ] Dashboard admin bisa diakses
- [ ] Tambah produk berhasil
- [ ] Register user biasa berhasil
- [ ] User biasa bisa melihat produk
- [ ] Semua CRUD operations berfungsi

---

## Ringkasan

Setelah mengikuti tutorial ini:

1. ✅ Project Supabase sudah siap
2. ✅ Database dengan semua tabel sudah dibuat
3. ✅ Storage buckets untuk gambar sudah siap
4. ✅ Admin user sudah di-setup
5. ✅ Aplikasi React sudah terhubung ke Supabase
6. ✅ Semua fitur CRUD berfungsi

Aplikasi Mixy Pet Shop sekarang menggunakan Supabase sebagai backend utama!
