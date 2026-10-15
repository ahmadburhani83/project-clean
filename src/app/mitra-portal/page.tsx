"use client";

import React, { useState } from "react";
import { MOCK_PARTNERS, MOCK_PRODUCTS } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/utils";
import { 
  Store, 
  Package, 
  ClipboardList, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Truck, 
  ShoppingBag,
  Sliders,
  DollarSign,
  ChevronRight
} from "lucide-react";

export default function MitraPortalPage() {
  const [activePartnerIndex, setActivePartnerIndex] = useState(0);
  const currentPartner = MOCK_PARTNERS[activePartnerIndex] || MOCK_PARTNERS[0];
  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "settings">("orders");

  // State pesanan demo di portal mitra
  const [orders, setOrders] = useState([
    {
      id: "ord-001",
      orderNumber: "KMN-20261015-8491",
      customerName: "Ahmad Fauzi (Laundry Bersih Wangi)",
      phone: "081234567890",
      itemsSummary: "Deterjen Cair 5L (2x), Pelicin Pakaian 5L (1x)",
      fulfillment: "Ambil di Toko",
      totalAmount: 262000,
      status: "pending",
      time: "10 menit lalu",
    },
    {
      id: "ord-002",
      orderNumber: "KMN-20261015-5124",
      customerName: "Ibu Ratna Dewi",
      phone: "081399887766",
      itemsSummary: "Sabun Cuci Piring 1L (3x), Karbol Pinus 1L (2x)",
      fulfillment: "Kurir Lokal Mitra",
      totalAmount: 108500,
      status: "processing",
      time: "45 menit lalu",
    },
    {
      id: "ord-003",
      orderNumber: "KMN-20261014-9921",
      customerName: "Bengkel AC Sejahtera",
      phone: "085211223344",
      itemsSummary: "Soda Api Flake 1Kg (5x)",
      fulfillment: "Ambil di Toko",
      totalAmount: 125000,
      status: "completed",
      time: "Kemarin",
    },
  ]);

  // State stok lokal demo
  const [inventoryStock, setInventoryStock] = useState<Record<string, number>>({
    "var-deterjen-5": 35,
    "var-cuci-piring-5": 50,
    "var-karbol-5": 20,
    "var-soda-api-1": 40,
    "var-texapon-1": 15,
  });

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const updateStock = (variantId: string, delta: number) => {
    setInventoryStock((prev) => {
      const current = prev[variantId] || 0;
      return { ...prev, [variantId]: Math.max(0, current + delta) };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Portal Mitra */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <Store className="w-3.5 h-3.5" /> Portal & Dashboard Manajemen Mitra
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {currentPartner.name}
          </h1>
          <p className="text-xs text-slate-400">
            Penanggung Jawab: <strong>{currentPartner.ownerName}</strong> • {currentPartner.address}, {currentPartner.city}
          </p>
        </div>

        {/* Dropdown Ganti Mitra untuk Demonstrasi */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1.5 shrink-0 w-full sm:w-auto">
          <span className="text-[10px] text-slate-400 block font-medium">Beralih Toko Mitra (Demo Mode):</span>
          <select
            value={activePartnerIndex}
            onChange={(e) => setActivePartnerIndex(Number(e.target.value))}
            className="w-full bg-slate-900 text-white border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-hidden"
          >
            {MOCK_PARTNERS.map((partner, index) => (
              <option key={partner.id} value={index}>
                {partner.name} ({partner.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Pesanan Baru Masuk</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {orders.filter((o) => o.status === "pending").length} Pesanan
          </p>
          <span className="text-[11px] text-amber-700 font-semibold block">Perlu konfirmasi ketersediaan</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Sedang Disiapkan</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {orders.filter((o) => o.status === "processing").length} Pesanan
          </p>
          <span className="text-[11px] text-blue-700 font-semibold block">Dalam proses packing / siap ambil</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Omset Mitra</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {formatRupiah(orders.reduce((acc, o) => acc + o.totalAmount, 0))}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold block">Periode bulan berjalan</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Rating Toko Mitra</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{currentPartner.rating} / 5.0</p>
          <span className="text-[11px] text-slate-500 block">Berdasarkan {currentPartner.reviewCount} ulasan pembeli</span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "orders"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Daftar Pesanan Pembeli ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "inventory"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Kelola Stok Inventaris Toko</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR PESANAN */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0 divide-y divide-slate-100">
          <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Daftar Pesanan Terbaru</span>
            <span className="text-[11px] font-normal text-slate-500">Update Realtime</span>
          </div>

          {orders.map((order) => {
            const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
              pending: { label: "Menunggu Konfirmasi", bg: "bg-amber-50 border-amber-200", text: "text-amber-800" },
              processing: { label: "Sedang Disiapkan", bg: "bg-blue-50 border-blue-200", text: "text-blue-800" },
              completed: { label: "Selesai", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800" },
            };
            const status = statusConfig[order.status] || statusConfig.pending;

            return (
              <div key={order.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {order.orderNumber}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                    <span className="text-[11px] text-slate-400">• {order.time}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{order.customerName}</h4>
                  <p className="text-xs text-slate-600 font-medium">{order.itemsSummary}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      {order.fulfillment === "Ambil di Toko" ? (
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      {order.fulfillment}
                    </span>
                    <span>Total: <strong className="text-slate-900">{formatRupiah(order.totalAmount)}</strong></span>
                  </div>
                </div>

                {/* Tombol Aksi Status Pesanan */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${order.phone.replace(/^0/, "62")}?text=${encodeURIComponent(
                      `Halo ${order.customerName}, kami dari ${currentPartner.name} mengonfirmasi pesanan ${order.orderNumber}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hubungi Pembeli</span>
                  </a>

                  {order.status === "pending" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "processing")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      Konfirmasi & Siapkan
                    </button>
                  )}

                  {order.status === "processing" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "completed")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      Tandai Sudah Diambil / Selesai
                    </button>
                  )}

                  {order.status === "completed" && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Pesanan Tuntas
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: KELOLA STOK INVENTARIS TOKO */}
      {activeTab === "inventory" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900">Manajemen Stok Toko Lokal</h3>
            <p className="text-xs text-slate-500">
              Perbarui ketersediaan produk di toko Anda. Produk yang berstok kosong akan otomatis dialihkan ke gudang pusat saat pembeli memesan.
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              { id: "var-deterjen-5", name: "Deterjen Cair Laundry Konsentrat Oxi-Power", variant: "5 Liter (Jerigen)", price: 95000 },
              { id: "var-cuci-piring-5", name: "Sabun Cuci Piring Jeruk Nipis Ultra Clean", variant: "5 Liter (Jerigen)", price: 68000 },
              { id: "var-karbol-5", name: "Karbol Pinus Wangi Disinfektan Antikuman", variant: "5 Liter (Jerigen)", price: 79000 },
              { id: "var-soda-api-1", name: "Soda Api Flake 98% (Caustic Soda)", variant: "1 Kg (Pouch)", price: 25000 },
              { id: "var-texapon-1", name: "Texapon 70% (SLES)", variant: "1 Kg (Pail Kecil)", price: 38000 },
            ].map((item) => {
              const stock = inventoryStock[item.id] || 0;

              return (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                    <p className="text-slate-500 font-medium">
                      Ukuran: <strong>{item.variant}</strong> • Harga Acuan: {formatRupiah(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => updateStock(item.id, -5)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded font-bold cursor-pointer"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => updateStock(item.id, -1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded font-bold cursor-pointer"
                      >
                        -1
                      </button>
                      <span className="px-4 font-black text-slate-900 text-sm">
                        {stock} unit
                      </span>
                      <button
                        onClick={() => updateStock(item.id, 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded font-bold cursor-pointer"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => updateStock(item.id, 5)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded font-bold cursor-pointer"
                      >
                        +5
                      </button>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        stock > 0
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {stock > 0 ? "Stok Siap" : "Habis"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
