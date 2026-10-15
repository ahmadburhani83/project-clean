"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { MOCK_PARTNERS } from "@/lib/mock-data";
import { PartnerStore } from "@/types/store.types";
import { calculateDistanceKm } from "@/lib/utils";
import { fetchLivePartners } from "@/lib/supabase/data-service";
import { 
  MapPin, 
  X, 
  Search, 
  Navigation, 
  Store, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  ShoppingBag,
  Star
} from "lucide-react";

export function PartnerSelectorModal() {
  const { 
    isPartnerModalOpen, 
    setPartnerModalOpen, 
    selectedPartner, 
    setSelectedPartner 
  } = useCartStore();

  const [partners, setPartners] = useState<PartnerStore[]>(MOCK_PARTNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    fetchLivePartners().then((data) => {
      if (data && data.length > 0) {
        setPartners(data);
      }
    });
  }, [isPartnerModalOpen]);

  // Daftar provinsi unik
  const provinces = useMemo(() => {
    const list = Array.from(new Set(partners.map((p) => p.province)));
    return ["all", ...list];
  }, [partners]);

  // Filter & Urutkan mitra (berdasarkan jarak terdekat jika lokasi terdeteksi)
  const filteredPartners = useMemo(() => {
    let result = partners.map((partner) => {
      let distanceKm: number | undefined = undefined;
      if (userLocation) {
        distanceKm = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          partner.latitude,
          partner.longitude
        );
      }
      return { ...partner, distanceKm };
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
  }, [partners, searchQuery, selectedProvince, userLocation]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Browser Anda tidak mendukung deteksi lokasi otomatis.");
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsDetectingLocation(false);
      },
      (error) => {
        setIsDetectingLocation(false);
        setLocationError("Gagal mendeteksi lokasi. Silakan pilih kota/provinsi manual di bawah.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectPartner = (partner: PartnerStore) => {
    setSelectedPartner(partner);
    setPartnerModalOpen(false);
  };

  if (!isPartnerModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-linear-to-r from-blue-700 to-indigo-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Pilih Mitra Daerah Terdekat</h3>
              <p className="text-xs text-blue-100">
                Pilih toko mitra untuk mendapatkan hemat ongkir & opsi ambil langsung di toko
              </p>
            </div>
          </div>
          <button
            onClick={() => setPartnerModalOpen(false)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar: Deteksi GPS & Search Input */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-60 cursor-pointer shrink-0"
            >
              <Navigation className={`w-4 h-4 ${isDetectingLocation ? "animate-spin" : ""}`} />
              {isDetectingLocation ? "Mencari Koordinat..." : "Deteksi Lokasi Otomatis (GPS)"}
            </button>

            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama toko, kota, atau kecamatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Filter Dropdown Provinsi */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-slate-500 font-medium whitespace-nowrap">Filter Provinsi:</span>
            {provinces.map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvince(prov)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                  selectedProvince === prov
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {prov === "all" ? "Semua Wilayah" : prov}
              </button>
            ))}
          </div>

          {locationError && (
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
              {locationError}
            </p>
          )}

          {userLocation && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Lokasi terdeteksi. Menampilkan mitra terurut dari jarak terdekat.</span>
            </div>
          )}
        </div>

        {/* List Mitra Daerah */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
          {filteredPartners.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Store className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700">Tidak ada mitra ditemukan di area pencarian ini.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Anda tetap dapat melakukan pemesanan via ekspedisi kargo resmi dari Gudang Pusat kami.
              </p>
            </div>
          ) : (
            filteredPartners.map((partner) => {
              const isCurrent = selectedPartner?.id === partner.id;

              return (
                <div
                  key={partner.id}
                  className={`pt-3 first:pt-0 p-3 rounded-xl transition-all ${
                    isCurrent
                      ? "bg-blue-50/70 border border-blue-200 shadow-xs"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                          {partner.name}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-[11px] font-bold rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Mitra Terpilih
                          </span>
                        )}
                        {partner.distanceKm !== undefined && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md">
                            📍 {partner.distanceKm} km dari Anda
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{partner.address}, Kec. {partner.district}, {partner.city}, {partner.province}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {partner.operationalHours}
                        </span>
                        <span className="flex items-center gap-1 text-amber-700 font-medium">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {partner.rating} ({partner.reviewCount} ulasan)
                        </span>
                      </div>

                      {/* Layanan Mitra Badge */}
                      <div className="flex items-center gap-2 pt-1">
                        {partner.supportsPickup && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                            <ShoppingBag className="w-3 h-3 text-blue-600" /> Bisa Ambil di Toko
                          </span>
                        )}
                        {partner.supportsLocalDelivery && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                            <Truck className="w-3 h-3 text-emerald-600" /> Kurir Lokal ({partner.serviceRadiusKm} km)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                      <button
                        onClick={() => handleSelectPartner(partner)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                          isCurrent
                            ? "bg-slate-200 text-slate-700 cursor-default"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                        }`}
                      >
                        {isCurrent ? "Sudah Dipilih" : "Pilih Mitra Ini"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Modal Info */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-600">
          Belum ada mitra di daerah Anda? Anda tetap bisa checkout dan pesanan akan dikirim via <strong>Ekspedisi Kargo Resmi Pabrik Pusat</strong>.
        </div>
      </div>
    </div>
  );
}
