# Kimia Nusantara 🧪
### Platform E-Commerce Toko Kimia & Kimia Rumah Tangga (Multi-Mitra Daerah)

Platform web modern untuk penjualan produk kimia rumah tangga siap pakai (deterjen laundry, sabun cuci piring, karbol, pelicin pakaian) dan bahan baku kimia teknis/industri (soda api NaOH, Texapon SLES, asam sitrat, bibit parfum, jerigen). 

Dilengkapi dengan sistem **Hyperlocal Order via Mitra Toko Daerah** untuk memecahkan kendala logistik barang cair/berat di Indonesia melalui fitur **Ambil di Toko (*Self-Pickup*)** atau **Kurir Lokal Mitra**, serta ekspedisi kargo resmi dari gudang pusat.

---

## 🌟 Fitur Utama

1. **Katalog Produk Hibrida:**
   - **Produk Kimia Rumah Tangga Siap Pakai:** Konsentrat ramah lingkungan untuk rumah tangga, laundry kiloan, dan resto.
   - **Bahan Kimia Teknis & Formula:** Kemasan 1 Kg hingga sak 25 Kg & pail drum 20L.
   - **Hazard Badges & Safety Guidelines:** Label peringatan keamanan kimia (Aman, Iritasi, Korosif, Beracun) serta panduan APD dan unduh lembar MSDS (*Material Safety Data Sheet*).
2. **Hyperlocal Partner Routing (Pemesanan via Mitra Daerah):**
   - Deteksi lokasi pembeli otomatis via GPS (Haversine Distance Formula).
   - Filter manual berdasarkan Provinsi, Kota/Kabupaten, dan Kecamatan.
   - Pilihan metode pemenuhan:
     - **Ambil di Toko Mitra:** Bebas biaya ongkir (*Gratis Ongkir*).
     - **Kurir Lokal Mitra:** Pengiriman same-day/instan dalam radius layanan mitra.
     - **Ekspedisi Kargo Pusat:** Pilihan otomatis jika di area pembeli belum ada mitra.
3. **Checkout & Notifikasi WhatsApp Otomatis:**
   - Integrasi WhatsApp instan dengan template rincian barang, alamat, dan total biaya langsung terkirim ke admin mitra pemenuh.
   - Pilihan pembayaran: QRIS, Transfer Bank, dan Bayar saat Ambil di Toko (COD).
4. **Portal Mitra (Partner Dashboard):**
   - Manajemen pesanan masuk & ubah status (Menunggu Konfirmasi ➔ Sedang Disiapkan ➔ Siap Diambil/Selesai).
   - Pengaturan stok inventaris lokal per mitra.
5. **Panel Super Admin (Backend Dashboard):**
   - Akses via `/admin` atau `/backend`.
   - Mengelola Master Produk Kimia (tambah, edit, hapus, atur tingkat bahaya & varian kemasan 1L/5L/20L/25kg).
   - Mengelola Jaringan Mitra Daerah (verifikasi mitra baru, atur radius km, GPS koordinat).
   - Pemantauan Pesanan Seluruh Indonesia (filter per mitra, ubah status pesanan, export rekap CSV).
   - Kepatuhan Keselamatan, Dokumen MSDS, dan Konfigurasi Database Supabase.
6. **Siap Deploy ke Vercel & Supabase:**
   - Serverless architecture di Vercel.
   - Managed PostgreSQL database, Auth, & Storage di Supabase.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS (v4)
- **State Management:** Zustand (dengan persistensi `localStorage`)
- **Icons:** Lucide React
- **Database & Backend:** Supabase (PostgreSQL, RLS Security, Haversine Query Function)
- **Hosting / Deployment:** Vercel

---

## 🚀 Panduan Menjalankan Proyek (Local Dev)

1. **Clone atau buka folder proyek:**
   ```bash
   cd project-clean
   ```

2. **Pastikan dependencies terinstal:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Panduan Setup Supabase Database

1. Buka dashboard [Supabase](https://supabase.com) dan buat proyek baru (*New Project*).
2. Masuk ke menu **SQL Editor**.
3. Buka file `supabase/schema.sql` di proyek ini, salin seluruh kodenya, lalu klik **Run** di Supabase SQL Editor.
4. Buka file `supabase/seed.sql`, salin kodenya, lalu klik **Run** untuk mengisi data awal kategori dan toko mitra percontohan di berbagai kota besar di Indonesia.
5. Masuk ke **Project Settings** -> **API**, salin `Project URL` dan `anon public key`.
6. Buat file `.env.local` pada root proyek Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ```

---

## ☁️ Panduan Deploy ke Vercel

1. Buat repository baru di GitHub / GitLab.
2. Push seluruh kode proyek ini ke repository Anda.
3. Buka [Vercel Dashboard](https://vercel.com) dan klik **Add New...** -> **Project**.
4. Import repository yang baru Anda buat.
5. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = (URL Supabase Anda)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Anon Key Supabase Anda)
6. Klik **Deploy**. Vercel akan otomatis mem-build dan mempublikasikan website Anda dalam waktu kurang dari 1 menit!

---

## 📁 Struktur Direktori

```text
├── src/
│   ├── app/
│   │   ├── page.tsx               # Halaman Beranda (Hero, Highlight Mitra, Produk Unggulan)
│   │   ├── katalog/page.tsx       # Katalog Produk dengan Filter Kategori, Jenis, & Hazard
│   │   ├── produk/[slug]/page.tsx # Detail Produk Dinamis, Varian Kemasan, & Stok Mitra
│   │   ├── mitra/page.tsx         # Direktori Titik Mitra se-Indonesia & Form Mitra Baru
│   │   ├── mitra-portal/page.tsx  # Dashboard Portal Mitra Daerah (Order & Stok Lokal)
│   │   ├── keranjang/page.tsx     # Keranjang Belanja & Pemilih Metode Pemenuhan
│   │   ├── checkout/page.tsx      # Formulir Checkout & Safety Checkbox
│   │   ├── pesanan-sukses/page.tsx# Konfirmasi Pesanan & Kirim WhatsApp ke Mitra
│   │   ├── layout.tsx             # Root Layout (Navbar, Footer, Global Modal)
│   │   └── globals.css            # Tailwind CSS styling
│   ├── components/
│   │   ├── layout/                # Navbar, Footer
│   │   ├── partner/               # PartnerSelectorModal (GPS & Filter Kota)
│   │   └── product/               # ProductCard, HazardBadge (Keamanan Kimia)
│   ├── lib/
│   │   ├── mock-data.ts           # Dataset Realistis Produk Kimia & Mitra Daerah
│   │   ├── utils.ts               # Formatter Rupiah, Haversine Distance, WA Generator
│   │   ├── store/cart-store.ts    # Zustand Store untuk Keranjang & Mitra Terpilih
│   │   └── supabase/              # Client & Server Supabase Helpers
│   └── types/
│       └── store.types.ts         # TypeScript Interfaces
├── supabase/
│   ├── schema.sql                 # Skema Tabel, RLS, & Fungsi SQL Haversine Jarak
│   └── seed.sql                   # Data Awal Kategori & Mitra Daerah
├── .env.example                   # Contoh konfigurasi Environment Variables
└── README.md
```

---

## 📄 Dokumen PRD
Dokumentasi lengkap Product Requirement Document dapat diakses pada:
- [`PRD-Toko-Kimia-dan-Mitra.md`](file:///C:/Users/pc-malta/.gemini/antigravity/brain/d22a108e-2a73-4c10-9f9b-6e062d4d17d4/PRD-Toko-Kimia-dan-Mitra.md)
