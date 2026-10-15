"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Order } from "@/types/store.types";
import { formatRupiah } from "@/lib/utils";
import { 
  CheckCircle2, 
  Store, 
  MapPin, 
  MessageSquare, 
  Printer, 
  ArrowRight, 
  Package, 
  Clock, 
  Truck, 
  ShoppingBag,
  ExternalLink
} from "lucide-react";

function SuccessOrderContent() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get("order");

  const [order, setOrder] = useState<Order | null>(null);
  const [waLink, setWaLink] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrder = sessionStorage.getItem("last_order");
      const storedWaLink = sessionStorage.getItem("last_wa_link");

      if (storedOrder) {
        setOrder(JSON.parse(storedOrder));
      }
      if (storedWaLink) {
        setWaLink(storedWaLink);
      }
    }
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      
      {/* Banner Berhasil */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Pesanan Anda Berhasil Dibuat!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-mono">
          Nomor Pesanan: <strong className="text-blue-600 text-sm">{order?.orderNumber || orderNumberParam || "KMN-SUCCESS"}</strong>
        </p>
      </div>

      {/* WhatsApp Action Button */}
      {waLink && (
        <div className="p-6 bg-linear-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xl space-y-3 text-center">
          <h3 className="font-bold text-base">Langkah Terakhir: Konfirmasi Pesanan ke Mitra</h3>
          <p className="text-xs text-emerald-100 max-w-md mx-auto">
            Klik tombol di bawah ini untuk mengirimkan format rincian pesanan langsung ke nomor WhatsApp admin mitra pemenuh:
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-extrabold text-sm shadow-md transition-transform hover:scale-102"
          >
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <span>Kirim Rincian Pesanan ke WhatsApp Mitra</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
          </a>
        </div>
      )}

      {/* Rincian Invoice Card */}
      {order && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs text-slate-400 block font-mono">INVOICE PESANAN</span>
              <h2 className="text-lg font-black text-slate-900">{order.orderNumber}</h2>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak Bukti
            </button>
          </div>

          {/* Info Mitra & Pemesan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 p-3 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-700 block flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-blue-600" /> Toko Mitra Pemenuh:
              </span>
              <p className="font-semibold text-slate-900">{order.selectedPartner?.name || "Gudang Pusat"}</p>
              <p className="text-slate-500">{order.selectedPartner?.address}, {order.selectedPartner?.city}</p>
              <p className="text-slate-500 font-mono">WA: {order.selectedPartner?.phone}</p>
            </div>

            <div className="space-y-1 p-3 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-700 block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Penerima Pesanan:
              </span>
              <p className="font-semibold text-slate-900">{order.customer.name}</p>
              <p className="text-slate-500">{order.customer.address}, Kec. {order.customer.district}, {order.customer.city}</p>
              <p className="text-slate-500 font-mono">WA: {order.customer.phone}</p>
            </div>
          </div>

          {/* Tabel Barang */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Daftar Produk:</h4>
            <div className="divide-y divide-slate-100 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between gap-4">
                  <div>
                    <span className="font-bold text-slate-900 block">{item.product.name}</span>
                    <span className="text-slate-500 text-[11px]">{item.variant.unitName} × {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {formatRupiah(item.variant.retailPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rincian Total */}
          <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Metode Pemenuhan</span>
              <span className="font-bold text-slate-900">
                {order.fulfillmentMethod === "partner-pickup"
                  ? "Ambil Langsung di Toko Mitra"
                  : order.fulfillmentMethod === "partner-delivery"
                  ? "Kurir Lokal Mitra"
                  : "Kargo Gudang Pusat"}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Metode Pembayaran</span>
              <span className="font-bold text-slate-900 uppercase">{order.paymentMethod.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Biaya Ongkos Kirim</span>
              <span className="font-bold text-slate-900">{order.shippingFee === 0 ? "GRATIS" : formatRupiah(order.shippingFee)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Biaya Pesanan</span>
              <span className="text-lg font-black text-blue-700">{formatRupiah(order.totalAmount)}</span>
            </div>
          </div>

        </div>
      )}

      {/* Navigasi Lanjutan */}
      <div className="text-center pt-4">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          <span>Kembali Berbelanja ke Katalog Produk</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto p-12 text-center text-slate-500">Memuat rincian pesanan...</div>}>
      <SuccessOrderContent />
    </Suspense>
  );
}
