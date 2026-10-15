"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { formatRupiah, generateWhatsAppOrderLink } from "@/lib/utils";
import { Order } from "@/types/store.types";
import { 
  Store, 
  MapPin, 
  Truck, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  MessageSquare,
  CreditCard,
  QrCode,
  Building,
  AlertTriangle
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    selectedPartner,
    fulfillmentMethod,
    customerInfo,
    setCustomerInfo,
    getTotalProductsAmount,
    getEstimatedShippingFee,
    getGrandTotal,
    clearCart,
  } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<"qris" | "transfer_bank" | "bayar_di_toko">("qris");
  const [safetyAgreed, setSafetyAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalProducts = getTotalProductsAmount();
  const shippingFee = getEstimatedShippingFee();
  const grandTotal = getGrandTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Tidak ada barang untuk di-checkout</h2>
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Pengiriman Anda.");
      return;
    }

    if (!safetyAgreed) {
      alert("Mohon centang persetujuan panduan keselamatan bahan kimia.");
      return;
    }

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `KMN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randomSuffix}`;

    const newOrder: Order = {
      id: "ord-" + Date.now(),
      orderNumber,
      customer: customerInfo,
      items: [...items],
      fulfillmentMethod,
      selectedPartner: selectedPartner || undefined,
      totalProductsAmount: totalProducts,
      shippingFee,
      totalAmount: grandTotal,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Buat tautan WhatsApp otomatis ke mitra
    const waLink = generateWhatsAppOrderLink(newOrder);

    // Simpan order terakhir di session storage untuk halaman sukses
    if (typeof window !== "undefined") {
      sessionStorage.setItem("last_order", JSON.stringify(newOrder));
      sessionStorage.setItem("last_wa_link", waLink);
    }

    // Bersihkan keranjang
    clearCart();

    // Arahkan ke halaman sukses
    router.push(`/pesanan-sukses?order=${orderNumber}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <Link
          href="/keranjang"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Keranjang
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Formulir Pemesanan & Pengiriman
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Form Data Pembeli & Metode Pembayaran */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Box 1: Informasi Titik Pemenuhan Mitra */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-blue-600" /> Titik Pemenuhan Pesanan
            </h3>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {selectedPartner ? selectedPartner.name : "Gudang Pusat"}
                </span>
                <span className="text-[11px] text-slate-600">
                  {selectedPartner ? `${selectedPartner.address}, ${selectedPartner.city}` : "Pengiriman kargo nasional"}
                </span>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-white px-3 py-1 rounded-lg border border-blue-200">
                {fulfillmentMethod === "partner-pickup"
                  ? "Ambil di Toko (Self-Pickup)"
                  : fulfillmentMethod === "partner-delivery"
                  ? "Kurir Lokal Mitra"
                  : "Kargo Gudang Pusat"}
              </span>
            </div>
          </div>

          {/* Box 2: Data Pembeli */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Data Penerima & Alamat
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Pratama"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nomor WhatsApp Aktif *</label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kota / Kabupaten *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jakarta Barat"
                  value={customerInfo.city}
                  onChange={(e) => setCustomerInfo({ city: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kecamatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cengkareng"
                  value={customerInfo.district}
                  onChange={(e) => setCustomerInfo({ district: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Alamat Lengkap Pengiriman / Domisili *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Nama jalan, nomor rumah, RT/RW, dan patokan..."
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Catatan Khusus Pesanan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Misal: Mohon packing bubble wrap ekstra / titip pos satpam"
                  value={customerInfo.notes || ""}
                  onChange={(e) => setCustomerInfo({ notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Box 3: Metode Pembayaran */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Pilih Metode Pembayaran
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === "qris"
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="payment"
                    value="qris"
                    checked={paymentMethod === "qris"}
                    onChange={() => setPaymentMethod("qris")}
                    className="text-blue-600"
                  />
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">QRIS Instan</span>
                </div>
                <span className="text-[10px] text-slate-500">Scan via GoPay, OVO, Dana, BCA Mobile, dll</span>
              </label>

              <label
                className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === "transfer_bank"
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="payment"
                    value="transfer_bank"
                    checked={paymentMethod === "transfer_bank"}
                    onChange={() => setPaymentMethod("transfer_bank")}
                    className="text-blue-600"
                  />
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">Transfer Bank</span>
                </div>
                <span className="text-[10px] text-slate-500">BCA, Mandiri, BRI rekening resmi</span>
              </label>

              <label
                className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === "bayar_di_toko"
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="payment"
                    value="bayar_di_toko"
                    checked={paymentMethod === "bayar_di_toko"}
                    onChange={() => setPaymentMethod("bayar_di_toko")}
                    className="text-blue-600"
                  />
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Bayar di Toko</span>
                </div>
                <span className="text-[10px] text-slate-500">Bayar tunai saat ambil pesanan di mitra</span>
              </label>
            </div>
          </div>

          {/* Box 4: Safety Checkbox */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3">
            <input
              type="checkbox"
              id="safety-terms"
              checked={safetyAgreed}
              onChange={(e) => setSafetyAgreed(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="safety-terms" className="text-xs text-amber-950 leading-relaxed cursor-pointer">
              <strong>Persetujuan Keamanan & Penanganan Bahan Kimia:</strong> Saya mengonfirmasi bahwa produk bahan kimia teknis yang saya pesan akan disimpan dan digunakan sesuai petunjuk keselamatan yang tertera pada kemasan dan lembar MSDS, serta menggunakan alat pelindung diri (APD) yang sesuai.
            </label>
          </div>

        </div>

        {/* Kolom Kanan: Rincian Produk & Konfirmasi Tombol */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-28">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Rincian Barang ({items.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100 text-xs">
              {items.map((item) => (
                <div key={item.variant.id} className="pt-2 first:pt-0 flex justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block line-clamp-1">{item.product.name}</span>
                    <span className="text-slate-500 text-[11px] block">{item.variant.unitName} × {item.quantity}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 shrink-0">
                    {formatRupiah(item.variant.retailPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Produk</span>
                <span className="font-bold text-slate-900">{formatRupiah(totalProducts)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim</span>
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isSubmitting ? "Memproses Pesanan..." : "Konfirmasi & Kirim Pesanan ke Mitra"}</span>
            </button>

            <p className="text-[11px] text-center text-slate-500 leading-snug">
              Setelah konfirmasi, format rincian pesanan akan disiapkan untuk otomatis dikirimkan ke WhatsApp mitra toko terpilih.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
}
