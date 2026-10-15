"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types/store.types";
import { HazardBadge } from "@/components/product/HazardBadge";
import { formatRupiah } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { ShoppingCart, Eye, Sparkles, FlaskConical } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  // Ambil harga terendah dari varian
  const lowestPrice = Math.min(...product.variants.map((v) => v.retailPrice));
  const primaryVariant = product.variants[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, primaryVariant, 1);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Gambar Produk */}
      <Link href={`/produk/${product.slug}`} className="relative block aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge Tipe: Rumah Tangga vs Kimia Teknis */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isHouseholdChemical ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
              <Sparkles className="w-3 h-3" /> Siap Pakai
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-700/90 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
              <FlaskConical className="w-3 h-3" /> Bahan Teknis
            </span>
          )}
        </div>

        {/* Hazard Badge di Pojok Kanan Atas */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <HazardBadge level={product.hazardLevel} size="sm" />
        </div>
      </Link>

      {/* Konten & Info Produk */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <span className="text-[11px] uppercase tracking-wider font-bold text-blue-600">
            {product.categoryLabel}
          </span>
          <Link href={`/produk/${product.slug}`}>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pilihan Varian Kemasan */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap gap-1">
            {product.variants.map((v) => (
              <span
                key={v.id}
                className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
              >
                {v.unitName}
              </span>
            ))}
          </div>

          {/* Harga & Tombol Aksi */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Mulai dari</span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900">
                {formatRupiah(lowestPrice)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href={`/produk/${product.slug}`}
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200"
                title="Lihat Detail Produk"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                onClick={handleQuickAdd}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Tambah ke Keranjang"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Keranjang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
