"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MOCK_PRODUCTS, MOCK_PARTNERS, CATEGORIES_LIST } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/utils";
import { Product, PartnerStore, HazardLevel, ProductCategory } from "@/types/store.types";
import { HazardBadge } from "@/components/product/HazardBadge";
import { 
  LayoutDashboard, 
  Package, 
  Store, 
  ClipboardList, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Truck, 
  Users, 
  Database, 
  ExternalLink,
  ShieldAlert,
  Download,
  Phone,
  Clock,
  Sparkles,
  FlaskConical,
  X
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "partners" | "orders" | "safety" | "settings">("overview");

  // State Produk (Master Data)
  const [productsList, setProductsList] = useState<Product[]>(MOCK_PRODUCTS);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Form Tambah Produk Baru
  const [newProductForm, setNewProductForm] = useState<{
    name: string;
    category: ProductCategory;
    isHouseholdChemical: boolean;
    hazardLevel: HazardLevel;
    description: string;
    unitName: string;
    retailPrice: number;
    weightGrams: number;
  }>({
    name: "",
    category: "rumah-tangga",
    isHouseholdChemical: true,
    hazardLevel: "aman",
    description: "",
    unitName: "5 Liter (Jerigen)",
    retailPrice: 75000,
    weightGrams: 5200,
  });

  // State Mitra Daerah
  const [partnersList, setPartnersList] = useState<PartnerStore[]>(MOCK_PARTNERS);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [newPartnerForm, setNewPartnerForm] = useState({
    name: "",
    ownerName: "",
    phone: "",
    whatsapp: "",
    city: "",
    province: "Jawa Barat",
    district: "",
    address: "",
    latitude: -6.2088,
    longitude: 106.8456,
    serviceRadiusKm: 25,
  });

  // State Pesanan Seluruh Indonesia (Orders Center)
  const [ordersList, setOrdersList] = useState([
    {
      id: "ord-101",
      orderNumber: "KMN-20261015-8491",
      customerName: "Ahmad Fauzi (Laundry Bersih Wangi)",
      customerPhone: "081234567890",
      customerCity: "Jakarta Barat",
      partnerName: "Mitra Kimia Jakarta Barat",
      partnerCity: "Jakarta Barat",
      itemsSummary: "Deterjen Cair 5L (2x), Pelicin Pakaian 5L (1x)",
      fulfillment: "Ambil di Toko",
      totalAmount: 262000,
      paymentMethod: "QRIS",
      status: "pending",
      date: "15 Okt 2026, 08:45 WIB",
    },
    {
      id: "ord-102",
      orderNumber: "KMN-20261015-5124",
      customerName: "Ibu Ratna Dewi",
      customerPhone: "081399887766",
      customerCity: "Bandung",
      partnerName: "Depo Kimia Priangan Bandung",
      partnerCity: "Bandung",
      itemsSummary: "Sabun Cuci Piring 1L (3x), Karbol Pinus 1L (2x)",
      fulfillment: "Kurir Lokal Mitra",
      totalAmount: 108500,
      paymentMethod: "Transfer BCA",
      status: "processing",
      date: "15 Okt 2026, 08:10 WIB",
    },
    {
      id: "ord-103",
      orderNumber: "KMN-20261014-9921",
      customerName: "Bengkel AC Sejahtera",
      customerPhone: "085211223344",
      customerCity: "Surabaya",
      partnerName: "Mitra Kimia Rungkut Surabaya",
      partnerCity: "Surabaya",
      itemsSummary: "Soda Api Flake 98% 1Kg (5x)",
      fulfillment: "Ambil di Toko",
      totalAmount: 125000,
      paymentMethod: "Bayar di Toko (COD)",
      status: "completed",
      date: "14 Okt 2026, 16:30 WIB",
    },
    {
      id: "ord-104",
      orderNumber: "KMN-20261014-7712",
      customerName: "CV Maju Mandiri Kimia",
      customerPhone: "081577665544",
      customerCity: "Semarang",
      partnerName: "Pusat Kimia Semarang Gayamsari",
      partnerCity: "Semarang",
      itemsSummary: "Texapon 70% 5Kg (2x), Citric Acid 5Kg (1x)",
      fulfillment: "Kurir Lokal Mitra",
      totalAmount: 480000,
      paymentMethod: "QRIS",
      status: "completed",
      date: "14 Okt 2026, 14:15 WIB",
    },
  ]);

  const [orderFilterPartner, setOrderFilterPartner] = useState("all");
  const [orderFilterStatus, setOrderFilterStatus] = useState("all");

  // Hitung Metrik Dashboard Ringkasan
  const totalOmset = ordersList.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalPesanan = ordersList.length;
  const totalMitraAktif = partnersList.length;
  const totalSKU = productsList.reduce((acc, p) => acc + p.variants.length, 0);

  // Filter Produk
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchCat = productCategoryFilter === "all" || p.category === productCategoryFilter;
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.categoryLabel.toLowerCase().includes(productSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [productsList, productCategoryFilter, productSearch]);

  // Filter Mitra
  const filteredPartners = useMemo(() => {
    return partnersList.filter((m) =>
      m.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      m.city.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      m.province.toLowerCase().includes(partnerSearch.toLowerCase())
    );
  }, [partnersList, partnerSearch]);

  // Filter Pesanan
  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      const matchPartner = orderFilterPartner === "all" || o.partnerName === orderFilterPartner;
      const matchStatus = orderFilterStatus === "all" || o.status === orderFilterStatus;
      return matchPartner && matchStatus;
    });
  }, [ordersList, orderFilterPartner, orderFilterStatus]);

  // Handler Tambah Produk
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: "prod-custom-" + Date.now(),
      name: newProductForm.name,
      slug: newProductForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: newProductForm.category,
      categoryLabel: newProductForm.isHouseholdChemical ? "Kimia Rumah Tangga" : "Bahan Kimia Teknis",
      description: newProductForm.description,
      features: ["Formula terstandar pabrik", "Kualitas teruji laboratorium", "Aman jika digunakan sesuai takaran"],
      hazardLevel: newProductForm.hazardLevel,
      isHouseholdChemical: newProductForm.isHouseholdChemical,
      image: newProductForm.isHouseholdChemical
        ? "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80"
        : "https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?auto=format&fit=crop&w=800&q=80",
      variants: [
        {
          id: "var-custom-" + Date.now(),
          productId: "prod-custom-" + Date.now(),
          unitName: newProductForm.unitName,
          sku: "SKU-" + Math.floor(1000 + Math.random() * 9000),
          basePrice: Math.round(newProductForm.retailPrice * 0.75),
          retailPrice: Number(newProductForm.retailPrice),
          weightGrams: Number(newProductForm.weightGrams),
        },
      ],
    };

    setProductsList([newProd, ...productsList]);
    setIsAddProductModalOpen(false);
    setNewProductForm({
      name: "",
      category: "rumah-tangga",
      isHouseholdChemical: true,
      hazardLevel: "aman",
      description: "",
      unitName: "5 Liter (Jerigen)",
      retailPrice: 75000,
      weightGrams: 5200,
    });
  };

  // Handler Hapus Produk
  const handleDeleteProduct = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini dari katalog master?")) {
      setProductsList(productsList.filter((p) => p.id !== id));
    }
  };

  // Handler Tambah Mitra Baru
  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    const newPartner: PartnerStore = {
      id: "partner-custom-" + Date.now(),
      name: newPartnerForm.name,
      slug: newPartnerForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      ownerName: newPartnerForm.ownerName,
      phone: newPartnerForm.phone,
      whatsapp: newPartnerForm.whatsapp || newPartnerForm.phone,
      address: newPartnerForm.address,
      city: newPartnerForm.city,
      province: newPartnerForm.province,
      district: newPartnerForm.district || newPartnerForm.city,
      latitude: Number(newPartnerForm.latitude),
      longitude: Number(newPartnerForm.longitude),
      serviceRadiusKm: Number(newPartnerForm.serviceRadiusKm),
      rating: 5.0,
      reviewCount: 0,
      operationalHours: "Senin - Sabtu: 08.00 - 17.00 WIB",
      supportsPickup: true,
      supportsLocalDelivery: true,
      stockMap: {},
    };

    setPartnersList([...partnersList, newPartner]);
    setIsAddPartnerModalOpen(false);
  };

  // Handler Update Status Order
  const handleUpdateOrderStatus = (orderId: string, nextStatus: string) => {
    setOrdersList(
      ordersList.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* TOP HEADER ADMIN */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-tight text-white">
                KIMIA<span className="text-blue-400">NUSANTARA</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                Super Admin Pusat
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Panel Pengendali Master Data & Logistik Kemitraan Nasional
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Koneksi Supabase */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-semibold">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase Ready</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors border border-slate-700"
          >
            <span>Buka Web Depan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* MAIN ADMIN CONTAINER */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 bg-slate-950/70 border-r border-slate-800 p-4 space-y-6 shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Menu Utama
            </span>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Ringkasan Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === "products"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Master Produk Kimia</span>
                </div>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                  {productsList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("partners")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === "partners"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Store className="w-4 h-4" />
                  <span>Jaringan Mitra Daerah</span>
                </div>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                  {partnersList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4" />
                  <span>Pesanan Seluruh Mitra</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  {ordersList.filter((o) => o.status === "pending").length} baru
                </span>
              </button>

              <button
                onClick={() => setActiveTab("safety")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === "safety"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Kepatuhan & MSDS</span>
              </button>
            </nav>
          </div>

          <div className="space-y-1 pt-4 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Konfigurasi Sistem
            </span>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan & Supabase</span>
            </button>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW RINGKASAN DASHBOARD */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Ringkasan Eksekutif Penjualan Nasional
                </h2>
                <p className="text-xs text-slate-400">
                  Statistik akumulatif seluruh transaksi dari mitra toko daerah dan gudang pusat.
                </p>
              </div>

              {/* 4 Kartu Metrik */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Total Omset Nasional</span>
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">{formatRupiah(totalOmset)}</p>
                  <span className="text-[11px] text-emerald-400 font-semibold block">↑ 18.4% dari bulan lalu</span>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Total Pesanan Selesai</span>
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">{totalPesanan} Pesanan</p>
                  <span className="text-[11px] text-blue-400 font-semibold block">Semua jalur (Ambil/Kurir/Kargo)</span>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Mitra Toko Aktif</span>
                    <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                      <Store className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">{totalMitraAktif} Toko</p>
                  <span className="text-[11px] text-purple-400 font-semibold block">Tersebar di 7 Provinsi</span>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Total SKU Kemasan</span>
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white">{totalSKU} Varian</p>
                  <span className="text-[11px] text-amber-400 font-semibold block">1L, 5L, 20L, 25Kg Sak</span>
                </div>
              </div>

              {/* Tabel Pesanan Terbaru */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden space-y-0">
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                    Pesanan Terbaru yang Perlu Dipantau
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-blue-400 hover:underline"
                  >
                    Buka Semua Pesanan →
                  </button>
                </div>

                <div className="divide-y divide-slate-700/60 text-xs">
                  {ordersList.slice(0, 3).map((order) => (
                    <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-750">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-400">{order.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {order.status}
                          </span>
                        </div>
                        <p className="font-bold text-white text-sm">{order.customerName}</p>
                        <p className="text-slate-400">{order.itemsSummary} • <strong>{order.fulfillment}</strong></p>
                      </div>

                      <div className="text-right sm:self-center">
                        <span className="text-sm font-extrabold text-white block">{formatRupiah(order.totalAmount)}</span>
                        <span className="text-[11px] text-slate-400">{order.partnerName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MASTER PRODUK & VARIAN (CRUD) */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Master Data Produk & Bahan Kimia</h2>
                  <p className="text-xs text-slate-400">Kelola katalog produk, tingkat bahaya GHS, harga eceran acuan, dan varian kemasan.</p>
                </div>

                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk Baru</span>
                </button>
              </div>

              {/* Bar Filter & Search Produk */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama produk kimia..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-medium focus:outline-hidden"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="rumah-tangga">Kimia Rumah Tangga</option>
                  <option value="laundry">Kimia Laundry</option>
                  <option value="industri">Bahan Kimia Teknis</option>
                  <option value="aroma-bibit">Aroma & Bibit Parfum</option>
                  <option value="kemasan">Kemasan & Jerigen</option>
                </select>
              </div>

              {/* Tabel List Produk */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden divide-y divide-slate-700/60">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-750 transition-colors">
                    <div className="flex items-center gap-4">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-14 h-14 object-cover rounded-xl bg-slate-900 shrink-0 border border-slate-700"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                            {prod.categoryLabel}
                          </span>
                          <HazardBadge level={prod.hazardLevel} size="sm" />
                          {prod.isHouseholdChemical ? (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                              Siap Pakai
                            </span>
                          ) : (
                            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold">
                              Bahan Teknis
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-white text-sm">{prod.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{prod.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-700">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">{prod.variants.length} Ukuran Varian</span>
                        <span className="font-black text-white text-sm">
                          Mulai {formatRupiah(Math.min(...prod.variants.map((v) => v.retailPrice)))}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: JARINGAN MITRA DAERAH (CRUD & VERIFIKASI) */}
          {activeTab === "partners" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Manajemen Jaringan Mitra Daerah</h2>
                  <p className="text-xs text-slate-400">Verifikasi pendaftaran mitra baru, radius coverage, dan lokasi koordinat GPS.</p>
                </div>

                <button
                  onClick={() => setIsAddPartnerModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Daftarkan Mitra Baru</span>
                </button>
              </div>

              {/* Search Bar Mitra */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari toko mitra berdasarkan nama, kota, atau provinsi..."
                    value={partnerSearch}
                    onChange={(e) => setPartnerSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Grid Kartu Mitra */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPartners.map((partner) => (
                  <div key={partner.id} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                          {partner.city}, {partner.province}
                        </span>
                        <h4 className="font-bold text-white text-base mt-0.5">{partner.name}</h4>
                        <p className="text-xs text-slate-300">Penanggung Jawab: <strong>{partner.ownerName}</strong></p>
                      </div>

                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold rounded-lg shrink-0">
                        Mitra Aktif
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{partner.address}, Kec. {partner.district}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                      <span>WhatsApp: <strong>{partner.whatsapp}</strong></span>
                      <span>•</span>
                      <span>Radius: <strong>{partner.serviceRadiusKm} km</strong></span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700 text-xs">
                      <span className="text-amber-400 font-bold">⭐ {partner.rating} ({partner.reviewCount} ulasan)</span>
                      <a
                        href={`https://wa.me/${partner.whatsapp.replace(/^0/, "62")}?text=${encodeURIComponent(
                          `Halo ${partner.name}, kami dari Kantor Pusat Kimia Nusantara ingin koordinasi stok.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" /> Chat Mitra
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PESANAN SELURUH MITRA (ORDERS CENTER) */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Monitoring Pesanan Nasional</h2>
                  <p className="text-xs text-slate-400">Pantau seluruh order yang masuk ke mitra-mitra daerah di Indonesia.</p>
                </div>

                <button
                  onClick={() => alert("Data rekapitulasi pesanan berhasil diexport ke format CSV.")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Rekap CSV</span>
                </button>
              </div>

              {/* Filter Mitra & Status */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 flex flex-wrap gap-3">
                <select
                  value={orderFilterPartner}
                  onChange={(e) => setOrderFilterPartner(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-medium focus:outline-hidden"
                >
                  <option value="all">Semua Mitra Daerah</option>
                  {partnersList.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>

                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-medium focus:outline-hidden"
                >
                  <option value="all">Semua Status Pesanan</option>
                  <option value="pending">Menunggu Konfirmasi</option>
                  <option value="processing">Sedang Disiapkan</option>
                  <option value="completed">Selesai</option>
                </select>
              </div>

              {/* Tabel Pesanan */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden divide-y divide-slate-700/60">
                {filteredOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                    processing: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                    completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                  };

                  return (
                    <div key={order.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-750 transition-colors">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-400 bg-slate-900 px-2 py-0.5 rounded">
                            {order.orderNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusColors[order.status] || ""}`}>
                            {order.status.toUpperCase()}
                          </span>
                          <span className="text-[11px] text-slate-400">• {order.date}</span>
                        </div>

                        <h4 className="font-bold text-white text-sm">{order.customerName}</h4>
                        <p className="text-xs text-slate-300 font-medium">{order.itemsSummary}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                          <span>Mitra Pemenuh: <strong className="text-slate-200">{order.partnerName}</strong></span>
                          <span>•</span>
                          <span>Fulfillment: <strong className="text-slate-200">{order.fulfillment}</strong></span>
                          <span>•</span>
                          <span>Metode: <strong className="text-slate-200">{order.paymentMethod}</strong></span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Total Nilai Pesanan:</span>
                          <span className="text-base font-black text-white">{formatRupiah(order.totalAmount)}</span>
                        </div>

                        {order.status === "pending" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "processing")}
                            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                          >
                            Setujui & Proses
                          </button>
                        )}

                        {order.status === "processing" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                          >
                            Tandai Selesai
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: KEPATUHAN KESELAMATAN & MSDS */}
          {activeTab === "safety" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white">Standar Keselamatan Kimia & Dokumen MSDS</h2>
                <p className="text-xs text-slate-400">Pengaturan kepatuhan hukum penjualan bahan kimia, lembar keselamatan, dan disclaimer APD.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5" />
                    <span>Peraturan Penjualan Bahan Korosif & Beracun</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Setiap transaksi yang memuat bahan kimia berlabel <strong>Korosif</strong> (misal: Soda Api NaOH, Asam Sitrat pekat) atau <strong>Beracun</strong> secara otomatis mewajibkan pembeli mencentang persetujuan kepatuhan APD (Alat Pelindung Diri) sebelum dapat menyelesaikan checkout.
                  </p>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-xs text-slate-400 space-y-1">
                    <span className="font-bold text-slate-200 block">Status Fitur: AKTIF (Enforced di Checkout)</span>
                    <span>• Pop-up konfirmasi keselamatan aktif</span>
                    <br />
                    <span>• Download MSDS terbuka di halaman detail produk</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
                  <h3 className="font-bold text-sm text-white">Daftar Dokumen MSDS Resmi Tersedia:</h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
                      <span>MSDS-Caustic-Soda-Flake-NaOH-98.pdf</span>
                      <span className="text-emerald-400 font-bold">Terunggah (Supabase Storage)</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
                      <span>MSDS-Texapon-SLES-70-Surfactant.pdf</span>
                      <span className="text-emerald-400 font-bold">Terunggah (Supabase Storage)</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
                      <span>MSDS-Citric-Acid-Anhydrous-Food-Grade.pdf</span>
                      <span className="text-emerald-400 font-bold">Terunggah (Supabase Storage)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PENGATURAN BACKEND & SUPABASE */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-in fade-in max-w-4xl">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white">Pengaturan Backend & Supabase Database</h2>
                <p className="text-xs text-slate-400">Status sinkronisasi basis data PostgreSQL, API keys, dan kontak operasional.</p>
              </div>

              {/* Kartu Status Supabase */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">Status Koneksi Supabase</h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                    Active / Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-slate-400 block">NEXT_PUBLIC_SUPABASE_URL</span>
                    <span className="text-blue-400 break-all">https://your-project.supabase.co</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
                    <span className="text-slate-400 block">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                    <span className="text-blue-400 truncate block">eyJhbGciOiJIUzI1NiIsInR5cCI6...</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl text-xs text-slate-400 space-y-1">
                  <p>Skema database SQL tersedia pada: <code>supabase/schema.sql</code></p>
                  <p>Data awal (Seed Data) tersedia pada: <code>supabase/seed.sql</code></p>
                </div>
              </div>

              {/* Pengaturan Nomor Pusat */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
                <h3 className="font-bold text-sm text-white">Kontak Hotline WhatsApp Pusat</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400">Nomor WhatsApp Pusat (Notifikasi CC):</label>
                    <input
                      type="text"
                      defaultValue="081234567890"
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">Email Operasional:</label>
                    <input
                      type="email"
                      defaultValue="support@kimianusantara.id"
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL 1: TAMBAH PRODUK BARU */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white">Tambah Produk Baru ke Katalog</h3>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Nama Produk Kimia *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembersih Kaca Anti-Jamur"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Kategori</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  >
                    <option value="rumah-tangga">Kimia Rumah Tangga</option>
                    <option value="laundry">Kimia Laundry</option>
                    <option value="industri">Bahan Kimia Teknis</option>
                    <option value="aroma-bibit">Aroma & Bibit</option>
                    <option value="kemasan">Kemasan & Jerigen</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Tingkat Bahaya Kimia</label>
                  <select
                    value={newProductForm.hazardLevel}
                    onChange={(e) => setNewProductForm({ ...newProductForm, hazardLevel: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  >
                    <option value="aman">Aman Rumah Tangga</option>
                    <option value="iritasi">Iritasi Ringan</option>
                    <option value="korosif">Korosif (Sarung Tangan)</option>
                    <option value="mudah-terbakar">Mudah Terbakar</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Deskripsi Produk & Manfaat</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Formula pembersih konsentrat ampuh membersihkan..."
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Ukuran Varian Awal</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 5 Liter (Jerigen)"
                    value={newProductForm.unitName}
                    onChange={(e) => setNewProductForm({ ...newProductForm, unitName: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Harga Retail (Rp)</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.retailPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, retailPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Berat (Gram)</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.weightGrams}
                    onChange={(e) => setNewProductForm({ ...newProductForm, weightGrams: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan Produk Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DAFTARKAN MITRA BARU */}
      {isAddPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white">Daftarkan Toko Mitra Daerah Baru</h3>
              <button onClick={() => setIsAddPartnerModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Nama Toko Mitra *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Mitra Kimia Solo Raya"
                    value={newPartnerForm.name}
                    onChange={(e) => setNewPartnerForm({ ...newPartnerForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Nama Pemilik *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Joko Widodo"
                    value={newPartnerForm.ownerName}
                    onChange={(e) => setNewPartnerForm({ ...newPartnerForm, ownerName: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={newPartnerForm.phone}
                    onChange={(e) => setNewPartnerForm({ ...newPartnerForm, phone: e.target.value, whatsapp: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Kota / Kabupaten *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Surakarta"
                    value={newPartnerForm.city}
                    onChange={(e) => setNewPartnerForm({ ...newPartnerForm, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Alamat Lengkap Toko / Gudang Mitra *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Nama jalan, nomor, RT/RW, dan patokan..."
                  value={newPartnerForm.address}
                  onChange={(e) => setNewPartnerForm({ ...newPartnerForm, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Radius Layanan (Km)</label>
                  <input
                    type="number"
                    value={newPartnerForm.serviceRadiusKm}
                    onChange={(e) => setNewPartnerForm({ ...newPartnerForm, serviceRadiusKm: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Latitude (GPS)</label>
                  <input
                    type="number"
                    step="any"
                    value={newPartnerForm.latitude}
                    onChange={(e) => setNewPartnerForm({ ...newPartnerForm, latitude: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Longitude (GPS)</label>
                  <input
                    type="number"
                    step="any"
                    value={newPartnerForm.longitude}
                    onChange={(e) => setNewPartnerForm({ ...newPartnerForm, longitude: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPartnerModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan Mitra Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
