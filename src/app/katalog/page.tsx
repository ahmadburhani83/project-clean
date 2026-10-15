"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_PRODUCTS, CATEGORIES_LIST } from "@/lib/mock-data";
import { ProductCard } from "@/components/product/ProductCard";
import { useCartStore } from "@/lib/store/cart-store";
import { Product } from "@/types/store.types";
import { fetchLiveProducts } from "@/lib/supabase/data-service";
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Store, 
  MapPin, 
  Sparkles, 
  FlaskConical,
  X
} from "lucide-react";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("kategori") || "semua";
  const initialSearch = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [productTypeFilter, setProductTypeFilter] = useState<"all" | "household" | "technical">("all");
  const [hazardFilter, setHazardFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"cheapest" | "expensive" | "name">("cheapest");

  const { selectedPartner, setPartnerModalOpen } = useCartStore();

  useEffect(() => {
    fetchLiveProducts().then((data) => {
      if (data && data.length > 0) {
        setProducts(data);
      }
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter Kategori
    if (selectedCategory !== "semua") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter Tipe Produk (Rumah Tangga vs Teknis)
    if (productTypeFilter === "household") {
      result = result.filter((p) => p.isHouseholdChemical);
    } else if (productTypeFilter === "technical") {
      result = result.filter((p) => !p.isHouseholdChemical);
    }

    // Filter Hazard Level
    if (hazardFilter !== "all") {
      result = result.filter((p) => p.hazardLevel === hazardFilter);
    }

    // Filter Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      const minA = Math.min(...a.variants.map((v) => v.retailPrice));
      const minB = Math.min(...b.variants.map((v) => v.retailPrice));
      if (sortBy === "cheapest") return minA - minB;
      if (sortBy === "expensive") return minB - minA;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [products, selectedCategory, productTypeFilter, hazardFilter, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("semua");
    setSearchQuery("");
    setProductTypeFilter("all");
    setHazardFilter("all");
    setSortBy("cheapest");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner Katalog & Partner Context */}
      <div className="bg-linear-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-200 uppercase tracking-wider">
            Katalog Lengkap
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Bahan Kimia Teknis & Formula Rumah Tangga
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Tersedia kemasan eceran 1L hingga drum/jerigen 20L dan sak 25kg. Dikirim langsung dari mitra terdekat atau gudang pusat.
          </p>
        </div>

        {/* Selected Partner Widget */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-xs space-y-2 shrink-0 w-full md:w-auto">
          <div className="flex items-center gap-2 text-blue-200 font-semibold">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Titik Pemenuhan Pesanan:</span>
          </div>
          <p className="font-bold text-white text-sm">
            {selectedPartner ? `${selectedPartner.name}` : "Gudang Pusat (Kargo)"}
          </p>
          <p className="text-slate-300 text-[11px]">
            {selectedPartner ? `${selectedPartner.city}, ${selectedPartner.province}` : "Belum memilih mitra lokal"}
          </p>
          <button
            onClick={() => setPartnerModalOpen(true)}
            className="w-full mt-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
          >
            {selectedPartner ? "Ganti Mitra Lain" : "Pilih Mitra Terdekat"}
          </button>
        </div>
      </div>

      {/* Filter and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filter Produk
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Filter Search Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Pencarian Kata Kunci</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nama produk / bahan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter Kategori */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Kategori</label>
              <div className="space-y-1">
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat.slug
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      selectedCategory === cat.slug ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Tipe: Rumah Tangga vs Kimia Teknis */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Tipe Produk</label>
              <div className="grid grid-cols-1 gap-1 text-xs">
                <button
                  onClick={() => setProductTypeFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-left cursor-pointer transition-colors ${
                    productTypeFilter === "all" ? "bg-slate-800 text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Semua Jenis
                </button>
                <button
                  onClick={() => setProductTypeFilter("household")}
                  className={`px-3 py-1.5 rounded-lg text-left cursor-pointer transition-colors flex items-center gap-1.5 ${
                    productTypeFilter === "household" ? "bg-emerald-600 text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Rumah Tangga Siap Pakai
                </button>
                <button
                  onClick={() => setProductTypeFilter("technical")}
                  className={`px-3 py-1.5 rounded-lg text-left cursor-pointer transition-colors flex items-center gap-1.5 ${
                    productTypeFilter === "technical" ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" /> Bahan Kimia Teknis
                </button>
              </div>
            </div>

            {/* Filter Hazard Level */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Tingkat Keamanan Kimia</label>
              <select
                value={hazardFilter}
                onChange={(e) => setHazardFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="all">Semua Tingkat Bahaya</option>
                <option value="aman">Aman Rumah Tangga</option>
                <option value="iritasi">Iritasi Ringan</option>
                <option value="korosif">Korosif (Gunakan Sarung Tangan)</option>
              </select>
            </div>

          </div>
        </aside>

        {/* Right Area: Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-500">
              Menampilkan <strong className="text-slate-900">{filteredProducts.length}</strong> produk kimia
            </span>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden"
              >
                <option value="cheapest">Harga Terendah</option>
                <option value="expensive">Harga Tertinggi</option>
                <option value="name">Nama Produk (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Grid Products */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <FlaskConical className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">Tidak ada produk yang cocok</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba ubah kata kunci atau hapus beberapa filter yang sedang aktif.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-500">Memuat katalog produk...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
