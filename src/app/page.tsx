"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_PRODUCTS, MOCK_PARTNERS } from "@/lib/mock-data";
import { ProductCard } from "@/components/product/ProductCard";
import { useCartStore } from "@/lib/store/cart-store";
import { 
  FlaskConical, 
  Sparkles, 
  Truck, 
  Store, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Package, 
  Building2, 
  Zap,
  PhoneCall
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const { selectedPartner, setPartnerModalOpen } = useCartStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/katalog?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push("/katalog");
    }
  };

  const householdProducts = MOCK_PRODUCTS.filter((p) => p.isHouseholdChemical);
  const technicalProducts = MOCK_PRODUCTS.filter((p) => !p.isHouseholdChemical);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-12 pb-20 sm:pt-20 sm:pb-32">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-blue-200 shadow-inner">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Solusi Pasokan Kimia & Rumah Tangga Terdekat di Kota Anda</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
              Pusat Toko Kimia & Pembersih Rumah Tangga{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 to-emerald-400">
                Hemat Ongkir via Mitra
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Dapatkan produk kimia rumah tangga siap pakai & bahan kimia teknis formulasi. Pesan lewat jaringan <strong>Mitra Daerah di kota Anda</strong> untuk pengiriman instan atau ambil langsung di toko!
            </p>

            {/* Hyperlocal Partner Indicator Pill */}
            <div className="pt-2">
              <button
                onClick={() => setPartnerModalOpen(true)}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/25 backdrop-blur-md text-left transition-all cursor-pointer group shadow-lg"
              >
                <div className="p-2 bg-blue-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-blue-200 block">Titik Pengambilan / Pengiriman Terpilih:</span>
                  <span className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    {selectedPartner ? `${selectedPartner.name} (${selectedPartner.city})` : "Pilih Mitra Daerah Terdekat"}
                    <span className="text-xs font-normal underline text-cyan-300 ml-1">Ubah Mitra</span>
                  </span>
                </div>
              </button>
            </div>

            {/* Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="pt-4 max-w-xl mx-auto">
              <div className="relative flex items-center shadow-2xl">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari deterjen, sabun cuci piring, soda api, texapon, dll..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-white text-slate-900 rounded-2xl text-sm sm:text-base placeholder-slate-400 focus:outline-hidden focus:ring-4 focus:ring-blue-500/40"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  Cari Produk
                </button>
              </div>
            </form>

            {/* Quick Keyword Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-1">
              <span>Pencarian populer:</span>
              <Link href="/katalog?q=Deterjen" className="hover:text-white underline">Deterjen Laundry</Link>
              <span>•</span>
              <Link href="/katalog?q=Cuci+Piring" className="hover:text-white underline">Sabun Cuci Piring</Link>
              <span>•</span>
              <Link href="/katalog?q=Soda+Api" className="hover:text-white underline">Soda Api Flake</Link>
              <span>•</span>
              <Link href="/katalog?q=Texapon" className="hover:text-white underline">Texapon SLES</Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4 VALUE PROPOSITIONS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-lg flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Jaringan Mitra Daerah</h4>
              <p className="text-xs text-slate-500 mt-1">Bisa ambil di toko langsung atau kurir lokal instan.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-lg flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Hemat Biaya Ongkos Kirim</h4>
              <p className="text-xs text-slate-500 mt-1">Bebas ongkir mahal cairan/berat berkat pasokan lokal.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-lg flex items-start gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Formula Siap Pakai & Teknis</h4>
              <p className="text-xs text-slate-500 mt-1">Produk rumah tangga siap pakai & bahan kimia mentah.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-lg flex items-start gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Terstandar & MSDS Jelas</h4>
              <p className="text-xs text-slate-500 mt-1">Label bahaya keamanan kimia dan panduan penanganan.</p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 1: PRODUK KIMIA RUMAH TANGGA UNGGULAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md mb-2">
              <Sparkles className="w-3.5 h-3.5" /> PRODUK SIAP PAKAI RUMAH TANGGA
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pembersih Rumah Tangga & Laundry
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Formula konsentrat kelas industri untuk rumah tangga, laundry kiloan, dan rumah makan.
            </p>
          </div>

          <Link
            href="/katalog?kategori=rumah-tangga"
            className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
          >
            <span>Lihat Semua Produk Rumah Tangga</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {householdProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 2: BAHAN BAKU KIMIA TEKNIS & FORMULA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-md mb-2">
              <FlaskConical className="w-3.5 h-3.5" /> PASOKAN BAHAN KIMIA INDUSTRI
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bahan Kimia Teknis & Kemasan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Bahan baku pembuatan sabun, pembersih pipa tersumbat, surfaktan, dan jerigen tebal.
            </p>
          </div>

          <Link
            href="/katalog?kategori=industri"
            className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
          >
            <span>Lihat Semua Bahan Kimia Teknis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {technicalProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 3: CARA KERJA ORDER LEWAT MITRA DAERAH */}
      <section className="bg-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
              Sistem Hyperlocal Logistik
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Bagaimana Cara Order Lewat Mitra Daerah?
            </h2>
            <p className="text-sm text-slate-400">
              Solusi cerdas menghindari ongkos kirim cairan kimia yang mahal via ekspedisi reguler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20">
                1
              </div>
              <h3 className="text-base font-bold text-white">Tentukan Mitra Daerah</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pilih toko mitra terdekat menggunakan GPS otomatis atau cari berdasarkan kota domisili Anda.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20">
                2
              </div>
              <h3 className="text-base font-bold text-white">Pilih Produk & Varian</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pilih ukuran kemasan (1L, Jerigen 5L, Pail 20L, atau Sak 25kg) sesuai kebutuhan Anda.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-emerald-500/20">
                3
              </div>
              <h3 className="text-base font-bold text-white">Pilih Metode Ambil</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pilih opsi <strong>Ambil di Toko Mitra (Gratis Ongkir)</strong> atau kirim via kurir lokal toko mitra.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-cyan-500/20">
                4
              </div>
              <h3 className="text-base font-bold text-white">Konfirmasi WhatsApp Instan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pesanan otomatis terformat rapi dan siap dikirimkan langsung ke nomor WhatsApp admin mitra Anda.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setPartnerModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-xl transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Cari Mitra Daerah Terdekat Sekarang</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION DAFTAR MITRA BARU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider text-blue-100">
              Kemitraan Distributor & Agen
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              Punya Toko Kimia atau Mau Jadi Agen Resmi di Daerah Anda?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Bergabunglah ke dalam jaringan mitra Kimia Nusantara. Dapatkan pasokan produk harga pabrik, ribuan pesanan online dari pelanggan di kota Anda, dan dashboard manajemen stok praktis.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/mitra#daftar"
                className="px-6 py-3.5 bg-white text-blue-800 hover:bg-blue-50 rounded-xl font-bold text-sm shadow-lg transition-colors cursor-pointer"
              >
                Daftar Jadi Mitra Daerah
              </Link>
              <Link
                href="/mitra-portal"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl font-bold text-sm transition-colors"
              >
                Demo Portal Mitra
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute -right-10 -bottom-10 opacity-15">
            <Building2 className="w-96 h-96 text-white" />
          </div>
        </div>
      </section>

    </div>
  );
}
