"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { HazardBadge } from "@/components/product/HazardBadge";
import { formatRupiah } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { Product } from "@/types/store.types";
import { fetchLiveProducts } from "@/lib/supabase/data-service";
import { 
  ShoppingCart, 
  MapPin, 
  Store, 
  ShieldAlert, 
  CheckCircle2, 
  Truck, 
  ArrowLeft, 
  FileText, 
  Minus, 
  Plus,
  Sparkles,
  FlaskConical,
  MessageSquare
} from "lucide-react";

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLiveProducts().then((data) => {
      if (data && data.length > 0) {
        setProducts(data);
      }
      setIsLoading(false);
    });
  }, []);

  const product = products.find((p) => p.slug === slug);

  const { 
    selectedPartner, 
    setPartnerModalOpen, 
    addItem 
  } = useCartStore();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  if (!product && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <FlaskConical className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">Produk Tidak Ditemukan</h2>
        <p className="text-slate-500 text-sm">Produk yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
      </div>
    );
  }

  if (!product && isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Memuat detail produk...</p>
      </div>
    );
  }

  if (!product) return null;

  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];

  // Cek ketersediaan stok di toko mitra terpilih
  const partnerStock = selectedPartner?.stockMap?.[currentVariant.id];
  const isAvailableInPartner = partnerStock !== undefined && partnerStock > 0;

  const handleAddToCart = () => {
    addItem(product, currentVariant, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleDirectOrder = () => {
    addItem(product, currentVariant, quantity);
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600">Beranda</Link>
        <span>/</span>
        <Link href="/katalog" className="hover:text-blue-600">Katalog</Link>
        <span>/</span>
        <Link href={`/katalog?kategori=${product.category}`} className="hover:text-blue-600">{product.categoryLabel}</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        
        {/* Kolom Kiri: Gambar Produk */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              {product.isHouseholdChemical ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md">
                  <Sparkles className="w-3.5 h-3.5" /> Formula Rumah Tangga Siap Pakai
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-700 text-white text-xs font-bold shadow-md">
                  <FlaskConical className="w-3.5 h-3.5" /> Bahan Kimia Teknis & Industri
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4">
              <HazardBadge level={product.hazardLevel} size="md" />
            </div>
          </div>

          {/* Jaminan Pasokan & Sertifikasi */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-600 pt-2">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="font-semibold block text-slate-800">100% Asli</span>
              <span className="text-[10px] text-slate-400">Segel Pabrik</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <Store className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span className="font-semibold block text-slate-800">Stok Lokal</span>
              <span className="text-[10px] text-slate-400">Mitra Daerah</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <Truck className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
              <span className="font-semibold block text-slate-800">Hemat Ongkir</span>
              <span className="text-[10px] text-slate-400">Ambil / Kurir</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Info Varian, Harga & Order */}
        <div className="space-y-6">
          
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {product.categoryLabel}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              SKU: {currentVariant.sku} • Berat: {currentVariant.weightGrams >= 1000 ? `${currentVariant.weightGrams / 1000} Kg` : `${currentVariant.weightGrams} gram`}
            </p>
          </div>

          {/* Harga Live Berdasarkan Varian */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block font-medium">Harga Retail Mitra:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-blue-900">
                  {formatRupiah(currentVariant.retailPrice)}
                </span>
                <span className="text-xs text-slate-500">/ {currentVariant.unitName}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-block">
                Harga Grosir / Eceran
              </span>
            </div>
          </div>

          {/* Pemilihan Varian Kemasan */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Pilih Ukuran Kemasan:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {product.variants.map((variant, index) => {
                const isSelected = selectedVariantIndex === index;
                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantIndex(index)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-900">
                      {variant.unitName}
                    </span>
                    <span className="block text-[11px] font-semibold text-blue-600 mt-1">
                      {formatRupiah(variant.retailPrice)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Ketersediaan di Mitra Daerah Terpilih */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" /> Ketersediaan di Mitra Daerah:
              </span>
              <button
                onClick={() => setPartnerModalOpen(true)}
                className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Ganti Mitra
              </button>
            </div>

            {selectedPartner ? (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{selectedPartner.name}</span>
                  {isAvailableInPartner ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready Stock ({partnerStock} unit)
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      Habis di Mitra • Kirim via Pusat
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {selectedPartner.address}, {selectedPartner.city}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {selectedPartner.supportsPickup && "✓ Ambil di Toko Langsung"} • {selectedPartner.supportsLocalDelivery && "✓ Kurir Lokal Mitra"}
                </p>
              </div>
            ) : (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">Belum memilih mitra terdekat</span>
                <button
                  onClick={() => setPartnerModalOpen(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
                >
                  Pilih Mitra
                </button>
              </div>
            )}
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Jumlah:</span>
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-slate-100 transition-colors text-slate-600 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-slate-100 transition-colors text-slate-600 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-slate-400">
                Total Subtotal: <strong className="text-slate-900">{formatRupiah(currentVariant.retailPrice * quantity)}</strong>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>+ Masukkan Keranjang</span>
              </button>

              <button
                onClick={handleDirectOrder}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <span>Beli Sekarang & Checkout</span>
              </button>
            </div>

            {addedToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Produk ({currentVariant.unitName} - {quantity}x) berhasil dimasukkan ke keranjang belanja!</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Deskripsi & Petunjuk Keselamatan Kimia (Safety Guidelines) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-slate-200">
        
        {/* Deskripsi & Keunggulan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Deskripsi & Spesifikasi Produk</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Keunggulan Utama:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Safety Guidelines Box */}
        <div className="space-y-4">
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-900">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm uppercase tracking-wider">
                Panduan Keselamatan Kimia
              </h3>
            </div>

            <p className="text-xs text-amber-950/90 leading-relaxed">
              {product.safetyGuidelines || "Gunakan Alat Pelindung Diri (APD) standar saat menangani bahan kimia pekat. Hindari kontak langsung dengan kulit dan mata."}
            </p>

            <div className="p-3 bg-white/70 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 space-y-1">
              <span className="font-bold block">Alat Pelindung Disarankan:</span>
              <span>• Sarung tangan karet / nitril tahan kimia</span>
              <br />
              <span>• Kacamata kerja pelindung (Safety Goggles)</span>
              <br />
              <span>• Masker pernapasan di ruang tertutup</span>
            </div>

            {product.msdsUrl && (
              <a
                href={product.msdsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:underline pt-1"
              >
                <FileText className="w-4 h-4" /> Unduh Dokumen MSDS (PDF)
              </a>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-500">Memuat rincian produk...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
