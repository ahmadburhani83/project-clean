"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { 
  Store, 
  ShoppingCart, 
  MapPin, 
  ChevronDown, 
  Menu, 
  X, 
  FlaskConical, 
  Sparkles, 
  ShieldCheck, 
  Building2,
  Search,
  LayoutDashboard
} from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    selectedPartner, 
    setPartnerModalOpen, 
    getTotalItemsCount 
  } = useCartStore();

  const totalItems = getTotalItemsCount();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Promo & Edukasi Logistik */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-blue-600/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Hyperlocal Mitra
            </span>
            <span className="truncate">
              Pesan bahan kimia & produk rumah tangga lewat <strong>Mitra Terdekat di Kota Anda</strong> untuk hemat ongkir!
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <Link href="/mitra" className="hover:text-white transition-colors flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Gabung Jadi Mitra
            </Link>
            <span>•</span>
            <Link href="/mitra-portal" className="hover:text-white transition-colors flex items-center gap-1">
              <Store className="w-3.5 h-3.5" /> Portal Mitra
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                  KIMIA<span className="text-blue-600">NUSANTARA</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Toko Kimia & Produk Rumah Tangga
              </p>
            </div>
          </Link>

          {/* Regional Partner Selector Pill */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => setPartnerModalOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 hover:bg-blue-50/80 border border-slate-300/80 hover:border-blue-400 rounded-xl transition-all text-left cursor-pointer group shadow-xs"
            >
              <div className="p-1.5 bg-blue-100/70 text-blue-700 rounded-lg group-hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-slate-500 block font-medium">Titik Pengambilan / Kirim:</span>
                <span className="font-bold text-slate-900 group-hover:text-blue-700 truncate max-w-[200px] block">
                  {selectedPartner ? `${selectedPartner.name} (${selectedPartner.city})` : "Pilih Mitra Terdekat"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 ml-1" />
            </button>
          </div>

          {/* Nav Links Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link href="/katalog" className="hover:text-blue-600 transition-colors">
              Katalog
            </Link>
            <Link href="/katalog?kategori=rumah-tangga" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rumah Tangga</span>
            </Link>
            <Link href="/katalog?kategori=industri" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
              <span>Kimia Teknis</span>
            </Link>
            <Link href="/mitra" className="hover:text-blue-600 transition-colors">
              Titik Mitra
            </Link>
          </nav>

          {/* Right Area: Search, Cart, Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Partner Selector Button */}
            <button
              onClick={() => setPartnerModalOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              title="Pilih Mitra Terdekat"
            >
              <MapPin className="w-5 h-5 text-blue-600" />
            </button>

            {/* Cart Icon */}
            <Link
              href="/keranjang"
              className="relative p-2.5 sm:px-3 sm:py-2 bg-blue-50/60 hover:bg-blue-100/80 text-blue-700 rounded-xl border border-blue-200/80 transition-all flex items-center gap-2"
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold">Keranjang</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 sm:static w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navbar: One-tap Partner Location Bar */}
      <div className="lg:hidden bg-slate-50 border-t border-slate-200/80 px-4 py-2">
        <button
          onClick={() => setPartnerModalOpen(true)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="truncate">
              <span className="text-[11px] text-slate-500 font-medium mr-1.5">Mitra Toko:</span>
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                {selectedPartner ? `${selectedPartner.name} (${selectedPartner.city})` : "Pilih Mitra Terdekat"}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-600 shrink-0 ml-2">Ubah ➔</span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          {/* Selected Partner Banner on Mobile */}
          <div 
            onClick={() => {
              setPartnerModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">Mitra Terpilih:</span>
                <span className="text-xs font-bold text-slate-900 block">
                  {selectedPartner ? `${selectedPartner.name} (${selectedPartner.city})` : "Pilih Mitra Terdekat"}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-blue-600">Ubah</span>
          </div>

          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700 pt-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              Beranda
            </Link>
            <Link
              href="/katalog"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              Semua Katalog Produk
            </Link>
            <Link
              href="/katalog?kategori=rumah-tangga"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 text-emerald-700"
            >
              <Sparkles className="w-4 h-4" /> Produk Kimia Rumah Tangga
            </Link>
            <Link
              href="/katalog?kategori=industri"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 text-blue-700"
            >
              <FlaskConical className="w-4 h-4" /> Bahan Kimia Teknis
            </Link>
            <Link
              href="/mitra"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-indigo-600" /> Jaringan Titik Mitra Daerah
            </Link>
            <Link
              href="/mitra-portal"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 text-slate-900 font-bold border-t border-slate-100 pt-3"
            >
              <Store className="w-4 h-4 text-blue-600" /> Portal Mitra (Dashboard)
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
