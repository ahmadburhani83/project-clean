"use client";

import React from "react";
import Link from "next/link";
import { useStoreProfile } from "@/lib/supabase/data-service";
import { 
  FlaskConical, 
  ShieldAlert, 
  FileText, 
  Phone, 
  MapPin, 
  Mail, 
  CheckCircle,
  Truck
} from "lucide-react";

export function Footer() {
  const storeProfile = useStoreProfile();

  return (
    <footer className="bg-slate-900 text-slate-300 text-sm mt-auto border-t border-slate-800">
      {/* Disclaimer Keamanan Kimia (Wajib untuk Toko Kimia) */}
      <div className="bg-amber-950/40 border-b border-amber-900/30 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300 font-semibold">Pemberitahuan Keselamatan & Kepatuhan Bahan Kimia:</strong> Seluruh produk bahan kimia teknis (seperti Soda Api NaOH, Asam Sitrat, Surfaktan) wajib ditangani dengan Alat Pelindung Diri (APD) sesuai panduan pada lembar MSDS (*Material Safety Data Sheet*). Jauhkan dari jangkauan anak-anak dan simpan di tempat kering dengan ventilasi yang baik.
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Kolom 1: Profil Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <FlaskConical className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                {storeProfile.storeName}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pusat pasokan bahan kimia teknis, industri, dan formula produk kimia pembersih rumah tangga terstandar. Didukung jaringan mitra distributor lokal untuk pengiriman cepat dan hemat ongkos kirim ke seluruh pelosok Indonesia.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Opsi Ambil di Mitra / Kurir Lokal / Kargo Pusat</span>
            </div>
          </div>

          {/* Kolom 2: Produk & Kategori */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kategori Produk</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/katalog?kategori=rumah-tangga" className="hover:text-blue-400 transition-colors">
                  Produk Kimia Rumah Tangga
                </Link>
              </li>
              <li>
                <Link href="/katalog?kategori=laundry" className="hover:text-blue-400 transition-colors">
                  Formula Kimia Laundry Profesional
                </Link>
              </li>
              <li>
                <Link href="/katalog?kategori=industri" className="hover:text-blue-400 transition-colors">
                  Bahan Baku Kimia Teknis (NaOH, SLES, dll)
                </Link>
              </li>
              <li>
                <Link href="/katalog?kategori=aroma-bibit" className="hover:text-blue-400 transition-colors">
                  Bibit Parfum & Fragrance Oil Murni
                </Link>
              </li>
              <li>
                <Link href="/katalog?kategori=kemasan" className="hover:text-blue-400 transition-colors">
                  Jerigen Plastik HDPE & Wadah Kimia
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Layanan Kemitraan */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Jaringan Kemitraan</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/mitra" className="hover:text-blue-400 transition-colors">
                  Daftar Titik Toko Mitra Daerah
                </Link>
              </li>
              <li>
                <Link href="/mitra-portal" className="hover:text-blue-400 transition-colors">
                  Portal & Dashboard Mitra
                </Link>
              </li>
              <li>
                <Link href="/mitra#daftar" className="hover:text-blue-400 transition-colors">
                  Syarat & Cara Gabung Mitra Baru
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 text-amber-300/90 font-semibold transition-colors">
                  Panel Super Admin (Backend) 🔐
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Cakupan: Jabodetabek, Bandung, Surabaya, Semarang, Medan, Makassar, Jogja.</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak & Bantuan */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Layanan Pelanggan</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Hotline: {storeProfile.hotlineWhatsApp}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>Email: {storeProfile.supportEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Gudang Pusat: {storeProfile.centralWarehouseAddress}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {storeProfile.storeName}. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <span>Published on Vercel</span>
            <span>•</span>
            <span>Powered by Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
