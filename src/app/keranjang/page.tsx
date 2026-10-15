"use client";

import React from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { formatRupiah } from "@/lib/utils";
import { 
  ShoppingCart, 
  Trash2, 
  Minus, 
  Plus, 
  MapPin, 
  Store, 
  Truck, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Package
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    selectedPartner,
    setPartnerModalOpen,
    fulfillmentMethod,
    setFulfillmentMethod,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalProductsAmount,
    getTotalWeightGrams,
    getEstimatedShippingFee,
    getGrandTotal,
  } = useCartStore();

  const totalProducts = getTotalProductsAmount();
  const totalWeightGrams = getTotalWeightGrams();
  const totalWeightKg = (totalWeightGrams / 1000).toFixed(1);
  const shippingFee = getEstimatedShippingFee();
  const grandTotal = getGrandTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Keranjang Belanja Anda Kosong</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Anda belum memilih produk kimia atau pembersih rumah tangga. Mari jelajahi katalog kami.
        </p>
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Mulai Belanja Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Keranjang Belanja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Total {items.length} jenis item dalam pesanan Anda.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" /> Kosongkan Keranjang
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Daftar Item Keranjang & Pilihan Pemenuhan */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Banner Mitra Pemenuh Pesanan */}
          <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Store className="w-4 h-4 text-blue-700" />
                <span>Titik Toko Mitra Pemenuh Pesanan:</span>
              </div>
              <button
                onClick={() => setPartnerModalOpen(true)}
                className="text-xs text-blue-700 font-bold hover:underline cursor-pointer"
              >
                Ganti Mitra
              </button>
            </div>

            {selectedPartner ? (
              <div className="bg-white p-3.5 rounded-xl border border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedPartner.name}</h4>
                  <p className="text-xs text-slate-500">{selectedPartner.address}, {selectedPartner.city}</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md self-start sm:self-auto">
                  Mitra Aktif
                </span>
              </div>
            ) : (
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center justify-between">
                <span className="text-xs text-amber-800">Belum memilih mitra terdekat</span>
                <button
                  onClick={() => setPartnerModalOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                >
                  Pilih Mitra Terdekat
                </button>
              </div>
            )}

            {/* Pemilihan Metode Pemenuhan (Fulfillment Method) */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Pilih Cara Pengambilan / Pengiriman:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setFulfillmentMethod("partner-pickup")}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    fulfillmentMethod === "partner-pickup"
                      ? "border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 bg-white/60 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Ambil di Toko</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold block">GRATIS ONGKIR</span>
                  <span className="text-[10px] text-slate-400">Self-pickup di mitra</span>
                </button>

                <button
                  onClick={() => setFulfillmentMethod("partner-delivery")}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    fulfillmentMethod === "partner-delivery"
                      ? "border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 bg-white/60 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Kurir Lokal Mitra</span>
                  </div>
                  <span className="text-[11px] text-slate-700 font-bold block">Rp 20.000 (Flat)</span>
                  <span className="text-[10px] text-slate-400">Instan area kota mitra</span>
                </button>

                <button
                  onClick={() => setFulfillmentMethod("central-cargo")}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    fulfillmentMethod === "central-cargo"
                      ? "border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 bg-white/60 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">Kargo Gudang Pusat</span>
                  </div>
                  <span className="text-[11px] text-slate-700 font-bold block">Tarif per Kg</span>
                  <span className="text-[10px] text-slate-400">Ekspedisi kargo kimia</span>
                </button>
              </div>
            </div>

          </div>

          {/* List Produk */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
            {items.map((item) => {
              const itemTotal = item.variant.retailPrice * item.quantity;

              return (
                <div key={item.variant.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        {item.product.categoryLabel}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Ukuran: <strong className="text-slate-800">{item.variant.unitName}</strong> • {formatRupiah(item.variant.retailPrice)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Berat: {item.variant.weightGrams * item.quantity >= 1000 ? `${(item.variant.weightGrams * item.quantity / 1000).toFixed(1)} Kg` : `${item.variant.weightGrams * item.quantity} g`}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-l-xl transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-r-xl transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm sm:text-base font-extrabold text-slate-900 block">
                        {formatRupiah(itemTotal)}
                      </span>
                      <button
                        onClick={() => removeItem(item.variant.id)}
                        className="text-[11px] text-red-500 hover:text-red-700 font-medium hover:underline cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Kolom Kanan: Ringkasan Biaya & Checkout */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-28">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Ringkasan Pesanan
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Harga Produk</span>
                <span className="font-bold text-slate-900">{formatRupiah(totalProducts)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Total Estimasi Berat</span>
                <span className="font-semibold text-slate-800">{totalWeightKg} Kg</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim ({fulfillmentMethod === "partner-pickup" ? "Ambil Sendiri" : fulfillmentMethod === "partner-delivery" ? "Kurir Lokal" : "Kargo Pusat"})</span>
                <span className={`font-bold ${shippingFee === 0 ? "text-emerald-600" : "text-slate-900"}`}>
                  {shippingFee === 0 ? "GRATIS" : formatRupiah(shippingFee)}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Pembayaran</span>
                <span className="text-xl font-black text-blue-700">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjut ke Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/katalog"
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-600 hover:text-blue-600 block transition-colors"
            >
              ← Lanjut Belanja Produk Lain
            </Link>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Transaksi Terjamin Aman</span>
              </div>
              <p>Produk bahan kimia dikemas aman dengan jerigen bersegel dan standar anti-tumpah.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
