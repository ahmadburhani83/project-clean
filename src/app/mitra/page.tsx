"use client";

import React, { useState, useMemo } from "react";
import { MOCK_PARTNERS } from "@/lib/mock-data";
import { useCartStore } from "@/lib/store/cart-store";
import { calculateDistanceKm } from "@/lib/utils";
import { PartnerStore } from "@/types/store.types";
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  Search, 
  Navigation, 
  Star,
  ExternalLink,
  Users,
  Handshake
} from "lucide-react";

export default function MitraDirectoryPage() {
  const { selectedPartner, setSelectedPartner } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Form pendaftaran mitra
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [partnerForm, setPartnerForm] = useState({
    storeName: "",
    ownerName: "",
    phone: "",
    city: "",
    province: "",
    address: "",
  });

  const provinces = useMemo(() => {
    const list = Array.from(new Set(MOCK_PARTNERS.map((p) => p.province)));
    return ["all", ...list];
  }, []);

  const filteredPartners = useMemo(() => {
    let result = MOCK_PARTNERS.map((p) => {
      let distanceKm: number | undefined = undefined;
      if (userLocation) {
        distanceKm = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          p.latitude,
          p.longitude
        );
      }
      return { ...p, distanceKm };
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    if (selectedProvince !== "all") {
      result = result.filter((p) => p.province === selectedProvince);
    }

    if (userLocation) {
      result.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    return result;
  }, [searchQuery, selectedProvince, userLocation]);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsDetecting(false);
      },
      () => {
        setIsDetecting(false);
      }
    );
  };

  const handleRegisterPartner = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200">
            <Building2 className="w-3.5 h-3.5" /> Jaringan Distribusi Nasional
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Titik Mitra Toko Kimia Daerah
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Temukan depo dan toko mitra resmi terdekat di kota Anda. Beli bahan kimia teknis dan pembersih rumah tangga dengan opsi ambil langsung (*self-pickup*) atau kurir lokal instan tanpa ongkir kargo antarpulau.
          </p>
        </div>
      </div>

      {/* Control Bar: Search & Province Filter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama mitra, kota, atau kecamatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleDetectGPS}
            disabled={isDetecting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <Navigation className={`w-4 h-4 ${isDetecting ? "animate-spin" : ""}`} />
            {isDetecting ? "Mencari GPS..." : "Urutkan dari Lokasi Saya"}
          </button>
        </div>

        {/* Filter Tab Provinsi */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-medium whitespace-nowrap">Wilayah:</span>
          {provinces.map((prov) => (
            <button
              key={prov}
              onClick={() => setSelectedProvince(prov)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedProvince === prov
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {prov === "all" ? "Semua Provinsi" : prov}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Mitra Daerah */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => {
          const isSelected = selectedPartner?.id === partner.id;

          return (
            <div
              key={partner.id}
              className={`bg-white rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between space-y-4 ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg bg-blue-50/20"
                  : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                      {partner.city}, {partner.province}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">
                      {partner.name}
                    </h3>
                  </div>

                  {isSelected && (
                    <span className="px-2.5 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mitra Aktif
                    </span>
                  )}
                </div>

                {partner.distanceKm !== undefined && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold">
                    📍 {partner.distanceKm} km dari posisi Anda
                  </div>
                )}

                <p className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{partner.address}, Kec. {partner.district}</span>
                </p>

                <div className="space-y-1 text-xs text-slate-500 pt-1">
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{partner.operationalHours}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span className="font-semibold text-slate-800">{partner.rating}</span> ({partner.reviewCount} ulasan pembeli)
                  </p>
                </div>

                {/* Fitur Layanan */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  {partner.supportsPickup && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-blue-600" /> Ambil di Toko
                    </span>
                  )}
                  {partner.supportsLocalDelivery && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium flex items-center gap-1">
                      <Truck className="w-3 h-3 text-emerald-600" /> Kurir Lokal ({partner.serviceRadiusKm} km)
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedPartner(partner)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-200 text-slate-700 cursor-default"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                  }`}
                >
                  {isSelected ? "Sedang Digunakan Sebagai Mitra Belanja" : "Pilih Sebagai Mitra Belanja"}
                </button>

                <a
                  href={`https://wa.me/${partner.whatsapp.replace(/^0/, "62")}?text=${encodeURIComponent(
                    `Halo ${partner.name}, saya ingin menanyakan ketersediaan produk kimia / pembersih rumah tangga.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chat WhatsApp Mitra</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION FORM PENDAFTARAN MITRA BARU */}
      <section id="daftar" className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-lg space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            <Handshake className="w-3.5 h-3.5" /> Peluang Kemitraan Toko & Distributor
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Formulir Pengajuan Menjadi Mitra Daerah Resmi
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Daftarkan toko bahan kimia, toko kelontong, atau depo Anda untuk menjadi titik pemenuhan pesanan resmi Kimia Nusantara di wilayah Anda. Nikmati margin keuntungan menarik dan limpahan pesanan dari pelanggan sekitar.
          </p>
        </div>

        {formSubmitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Pengajuan Kemitraan Berhasil Dikirim!</span>
            </div>
            <p className="text-xs text-emerald-700">
              Tim divisi kemitraan pusat kami akan menghubungi Anda melalui WhatsApp di nomor <strong>{partnerForm.phone}</strong> dalam 1x24 jam kerja untuk proses verifikasi dan aktivasi akun toko.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegisterPartner} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Toko / Usaha *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Toko Kimia Makmur Jaya"
                value={partnerForm.storeName}
                onChange={(e) => setPartnerForm({ ...partnerForm, storeName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Pemilik / Penanggung Jawab *</label>
              <input
                type="text"
                required
                placeholder="Nama lengkap Anda"
                value={partnerForm.ownerName}
                onChange={(e) => setPartnerForm({ ...partnerForm, ownerName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nomor WhatsApp Aktif *</label>
              <input
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={partnerForm.phone}
                onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kota / Kabupaten *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Tangerang / Solo / Malang"
                value={partnerForm.city}
                onChange={(e) => setPartnerForm({ ...partnerForm, city: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700">Alamat Lengkap Toko / Depo *</label>
              <textarea
                rows={3}
                required
                placeholder="Jalan, nomor, kelurahan, kecamatan, dan patokan lokasi..."
                value={partnerForm.address}
                onChange={(e) => setPartnerForm({ ...partnerForm, address: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Kirim Pengajuan Kemitraan
              </button>
            </div>
          </form>
        )}
      </section>

    </div>
  );
}
