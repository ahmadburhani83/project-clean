"use client";

import { useEffect, useState } from "react";
import { createClient } from "./client";
import { Product, PartnerStore, Order, ProductCategory, HazardLevel } from "@/types/store.types";
import { MOCK_PRODUCTS, MOCK_PARTNERS } from "@/lib/mock-data";

export interface StoreProfileData {
  storeName: string;
  tagline: string;
  topBannerText: string;
  centralWarehouseAddress: string;
  hotlineWhatsApp: string;
  supportEmail: string;
  cargoNotes: string;
}

export const DEFAULT_STORE_PROFILE: StoreProfileData = {
  storeName: "KIMIA NUSANTARA",
  tagline: "Toko Kimia & Produk Rumah Tangga",
  topBannerText: "Pesan bahan kimia & produk rumah tangga lewat Mitra Terdekat di Kota Anda untuk hemat ongkir!",
  centralWarehouseAddress: "Kawasan Industri Cikupa Mas Blok B-12, Tangerang, Banten",
  hotlineWhatsApp: "081234567890",
  supportEmail: "support@kimianusantara.id",
  cargoNotes: "Pengiriman luar kota menggunakan armada kargo khusus cairan bersegel.",
};

// ==========================================================
// 1. MANAJEMEN PROFIL & IDENTITAS TOKO
// ==========================================================

export async function fetchStoreProfile(): Promise<StoreProfileData> {
  // 1. Coba ambil dari Supabase
  const client = createClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("store_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();

      if (!error && data) {
        const loaded: StoreProfileData = {
          storeName: data.store_name || DEFAULT_STORE_PROFILE.storeName,
          tagline: data.tagline || DEFAULT_STORE_PROFILE.tagline,
          topBannerText: data.top_banner_text || DEFAULT_STORE_PROFILE.topBannerText,
          centralWarehouseAddress: data.central_warehouse_address || DEFAULT_STORE_PROFILE.centralWarehouseAddress,
          hotlineWhatsApp: data.hotline_whatsapp || DEFAULT_STORE_PROFILE.hotlineWhatsApp,
          supportEmail: data.support_email || DEFAULT_STORE_PROFILE.supportEmail,
          cargoNotes: data.cargo_notes || DEFAULT_STORE_PROFILE.cargoNotes,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_store_profile", JSON.stringify(loaded));
        }
        return loaded;
      }
    } catch (err) {
      console.warn("Gagal fetch store profile dari Supabase:", err);
    }
  }

  // 2. Fallback ke LocalStorage
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("admin_store_profile");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
  }

  return DEFAULT_STORE_PROFILE;
}

export async function saveStoreProfile(profile: StoreProfileData): Promise<{ error: any }> {
  // Simpan ke localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_store_profile", JSON.stringify(profile));
    window.dispatchEvent(new Event("store_profile_updated"));
  }

  // Simpan ke Supabase
  const client = createClient();
  if (!client) {
    return { error: new Error("Supabase belum terhubung. Tersimpan di browser lokal saja.") };
  }

  try {
    const { error } = await client.from("store_settings").upsert({
      id: "default",
      store_name: profile.storeName,
      tagline: profile.tagline,
      top_banner_text: profile.topBannerText,
      central_warehouse_address: profile.centralWarehouseAddress,
      hotline_whatsapp: profile.hotlineWhatsApp,
      support_email: profile.supportEmail,
      cargo_notes: profile.cargoNotes,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });

    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

// React Hook untuk profil toko (Navbar, Footer, Layout)
export function useStoreProfile() {
  const [profile, setProfile] = useState<StoreProfileData>(DEFAULT_STORE_PROFILE);

  useEffect(() => {
    // Muat data awal dari localStorage jika ada
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("admin_store_profile");
      if (cached) {
        try { setProfile(JSON.parse(cached)); } catch {}
      }
    }

    // Ambil yang paling update dari Supabase
    fetchStoreProfile().then(setProfile);

    // Dengar update instan antar komponen
    const handleUpdate = () => {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("admin_store_profile");
        if (cached) {
          try { setProfile(JSON.parse(cached)); } catch {}
        }
      }
    };

    window.addEventListener("store_profile_updated", handleUpdate);
    return () => window.removeEventListener("store_profile_updated", handleUpdate);
  }, []);

  return profile;
}

// ==========================================================
// 2. MANAJEMEN PRODUK & VARIAN KIMIA
// ==========================================================

export async function fetchLiveProducts(): Promise<Product[]> {
  const client = createClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("products")
        .select("*, product_variants(*)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const catMap: Record<string, ProductCategory> = {
          "11111111-1111-1111-1111-111111111101": "rumah-tangga",
          "11111111-1111-1111-1111-111111111102": "laundry",
          "11111111-1111-1111-1111-111111111103": "industri",
          "11111111-1111-1111-1111-111111111104": "aroma-bibit",
          "11111111-1111-1111-1111-111111111105": "kemasan",
        };
        const catLabelMap: Record<string, string> = {
          "rumah-tangga": "Kimia Rumah Tangga",
          "laundry": "Kimia Laundry",
          "industri": "Bahan Kimia Teknis",
          "aroma-bibit": "Aroma & Bibit Parfum",
          "kemasan": "Kemasan & Jerigen",
        };

        const mapped: Product[] = data.map((p: any) => {
          const cat = catMap[p.category_id] || "rumah-tangga";
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: cat,
            categoryLabel: catLabelMap[cat] || "Kimia Produk",
            isHouseholdChemical: p.is_household_chemical !== false,
            hazardLevel: (p.hazard_level || "aman") as HazardLevel,
            description: p.description || "",
            features: Array.isArray(p.features) ? p.features : [],
            safetyGuidelines: p.safety_guidelines || "",
            msdsUrl: p.msds_url || undefined,
            image: p.image_url || "",
            variants: (p.product_variants || []).map((v: any) => ({
              id: v.id,
              productId: p.id,
              unitName: v.unit_name,
              sku: v.sku,
              basePrice: Number(v.base_price),
              retailPrice: Number(v.retail_price),
              weightGrams: Number(v.weight_grams),
            })),
          };
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("admin_products_data", JSON.stringify(mapped));
        }
        return mapped;
      }
    } catch (e) {
      console.warn("Gagal ambil produk live dari Supabase:", e);
    }
  }

  // Fallback ke LocalStorage
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("admin_products_data");
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
  }

  return MOCK_PRODUCTS;
}

export async function saveLiveProduct(prod: Product): Promise<{ error: any }> {
  const client = createClient();
  if (!client) {
    return { error: new Error("Supabase belum terhubung. Produk tersimpan di memori browser.") };
  }

  try {
    const catMap: Record<string, string> = {
      "rumah-tangga": "11111111-1111-1111-1111-111111111101",
      "laundry": "11111111-1111-1111-1111-111111111102",
      "industri": "11111111-1111-1111-1111-111111111103",
      "aroma-bibit": "11111111-1111-1111-1111-111111111104",
      "kemasan": "11111111-1111-1111-1111-111111111105",
    };
    const categoryId = catMap[prod.category] || "11111111-1111-1111-1111-111111111101";

    const { data: upsertedProduct, error: prodErr } = await client.from("products").upsert({
      name: prod.name,
      slug: prod.slug,
      category_id: categoryId,
      description: prod.description,
      features: prod.features || [],
      safety_guidelines: prod.safetyGuidelines || "",
      hazard_level: prod.hazardLevel || "aman",
      msds_url: prod.msdsUrl || null,
      is_household_chemical: prod.isHouseholdChemical !== false,
      image_url: prod.image,
      is_active: true
    }, { onConflict: "slug" }).select("id").single();

    if (prodErr) return { error: prodErr };

    if (upsertedProduct?.id && prod.variants) {
      for (const v of prod.variants) {
        await client.from("product_variants").upsert({
          product_id: upsertedProduct.id,
          sku: v.sku,
          unit_name: v.unitName,
          base_price: v.basePrice,
          retail_price: v.retailPrice,
          weight_grams: v.weightGrams,
          is_active: true
        }, { onConflict: "sku" });
      }
    }

    return { error: null };
  } catch (err: any) {
    return { error: err };
  }
}

export async function deleteLiveProduct(slug: string): Promise<{ error: any }> {
  const client = createClient();
  if (!client) return { error: new Error("Supabase tidak aktif") };
  try {
    const { error } = await client.from("products").delete().eq("slug", slug);
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

// ==========================================================
// 3. MANAJEMEN MITRA DAERAH
// ==========================================================

export async function fetchLivePartners(): Promise<PartnerStore[]> {
  const client = createClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("partners")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: PartnerStore[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          slug: d.slug,
          ownerName: d.owner_name || "-",
          phone: d.phone || "-",
          whatsapp: d.whatsapp || d.phone || "-",
          city: d.city || "-",
          province: d.province || "-",
          district: d.district || d.city || "-",
          address: d.address || "-",
          latitude: Number(d.latitude) || -6.2088,
          longitude: Number(d.longitude) || 106.8456,
          serviceRadiusKm: Number(d.service_radius_km) || 25,
          rating: Number(d.rating) || 5.0,
          reviewCount: Number(d.review_count) || 0,
          operationalHours: d.operational_hours || "Senin - Sabtu: 08.00 - 17.00 WIB",
          supportsPickup: d.supports_pickup !== false,
          supportsLocalDelivery: d.supports_local_delivery !== false,
          stockMap: {},
        }));

        if (typeof window !== "undefined") {
          localStorage.setItem("admin_partners_data", JSON.stringify(mapped));
        }
        return mapped;
      }
    } catch (e) {
      console.warn("Gagal ambil mitra live dari Supabase:", e);
    }
  }

  // Fallback ke LocalStorage
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("admin_partners_data");
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
  }

  return MOCK_PARTNERS;
}

export async function saveLivePartner(partner: PartnerStore): Promise<{ error: any }> {
  const client = createClient();
  if (!client) {
    return { error: new Error("Supabase belum terhubung. Data mitra tersimpan di browser.") };
  }

  try {
    const payload: any = {
      name: partner.name,
      slug: partner.slug,
      owner_name: partner.ownerName,
      phone: partner.phone,
      whatsapp: partner.whatsapp,
      address: partner.address,
      city: partner.city,
      province: partner.province || "Jawa Barat",
      district: partner.district || partner.city,
      latitude: Number(partner.latitude) || -6.2088,
      longitude: Number(partner.longitude) || 106.8456,
      service_radius_km: Number(partner.serviceRadiusKm) || 25,
      rating: partner.rating || 5.0,
      review_count: partner.reviewCount || 0,
      operational_hours: partner.operationalHours || "Senin - Sabtu: 08.00 - 17.00 WIB",
      supports_pickup: partner.supportsPickup ?? true,
      supports_local_delivery: partner.supportsLocalDelivery ?? true,
      is_active: true
    };

    const { error } = await client.from("partners").upsert(payload, { onConflict: "slug" });
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

export async function deleteLivePartner(slug: string): Promise<{ error: any }> {
  const client = createClient();
  if (!client) return { error: new Error("Supabase tidak aktif") };
  try {
    const { error } = await client.from("partners").delete().eq("slug", slug);
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

// ==========================================================
// 4. MANAJEMEN PESANAN (CHECKOUT & ADMIN ORDERS)
// ==========================================================

export async function createCustomerOrder(order: Order): Promise<{ error: any; orderId?: string }> {
  // Simpan ke local storage agar admin langsung bisa melihatnya
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem("admin_orders_data");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: `${order.customer.name} (${order.customer.phone})`,
        customerPhone: order.customer.phone,
        customerCity: order.customer.city,
        partnerName: order.selectedPartner?.name || "Gudang Pusat",
        partnerCity: order.selectedPartner?.city || "Tangerang",
        itemsSummary: order.items.map(i => `${i.product.name} - ${i.variant.unitName} (${i.quantity}x)`).join(", "),
        fulfillment: order.fulfillmentMethod === "partner-pickup" ? "Ambil di Toko" : order.fulfillmentMethod === "partner-delivery" ? "Kurir Lokal Mitra" : "Kargo Pusat",
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " WIB",
      });
      localStorage.setItem("admin_orders_data", JSON.stringify(list));
    } catch {}
  }

  // Simpan ke Supabase
  const client = createClient();
  if (!client) {
    return { error: null }; // Berhasil simpan offline / local
  }

  try {
    // Map fulfillment method to supabase enum
    let fulfillmentEnum: "partner_pickup" | "partner_delivery" | "central_cargo" = "partner_pickup";
    if (order.fulfillmentMethod === "partner-delivery") fulfillmentEnum = "partner_delivery";
    if (order.fulfillmentMethod === "central-cargo") fulfillmentEnum = "central_cargo";

    // 1. Insert order
    const { data: createdOrder, error: orderErr } = await client.from("orders").insert({
      order_number: order.orderNumber,
      partner_id: order.selectedPartner?.id?.includes("-") && order.selectedPartner.id.length === 36 ? order.selectedPartner.id : null,
      fulfillment_type: fulfillmentEnum,
      status: "pending",
      total_products_amount: order.totalProductsAmount,
      shipping_fee: order.shippingFee,
      total_amount: order.totalAmount,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      customer_email: order.customer.email || null,
      shipping_address: order.customer.address,
      shipping_city: order.customer.city,
      shipping_district: order.customer.district || order.customer.city,
      shipping_province: order.customer.province || null,
      notes: order.customer.notes || null,
      payment_method: order.paymentMethod,
    }).select("id").single();

    if (orderErr) {
      console.warn("Gagal insert order ke Supabase:", orderErr);
      return { error: orderErr };
    }

    // 2. Insert order items
    if (createdOrder?.id && order.items && order.items.length > 0) {
      const itemsPayload = order.items.map((it) => ({
        order_id: createdOrder.id,
        variant_id: it.variant.id?.includes("-") && it.variant.id.length === 36 ? it.variant.id : null,
        product_name: it.product.name,
        unit_name: it.variant.unitName,
        quantity: it.quantity,
        unit_price: it.variant.retailPrice,
        subtotal: it.variant.retailPrice * it.quantity,
      }));

      await client.from("order_items").insert(itemsPayload);
    }

    return { error: null, orderId: createdOrder?.id };
  } catch (err: any) {
    console.error("Error creating order in Supabase:", err);
    return { error: err };
  }
}

export async function fetchLiveOrders(): Promise<any[]> {
  const client = createClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("orders")
        .select("*, order_items(*), partners(name, city)")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          customerName: `${o.customer_name} (${o.customer_phone})`,
          customerPhone: o.customer_phone,
          customerCity: o.shipping_city,
          partnerName: o.partners?.name || "Gudang Pusat",
          partnerCity: o.partners?.city || "Tangerang",
          itemsSummary: (o.order_items || []).map((i: any) => `${i.product_name} ${i.unit_name} (${i.quantity}x)`).join(", ") || "1x Pesanan Produk",
          fulfillment: o.fulfillment_type === "partner_pickup" ? "Ambil di Toko" : o.fulfillment_type === "partner_delivery" ? "Kurir Lokal Mitra" : "Kargo Pusat",
          totalAmount: Number(o.total_amount),
          paymentMethod: o.payment_method?.toUpperCase() || "QRIS",
          status: o.status,
          date: new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " WIB",
        }));

        if (typeof window !== "undefined") {
          localStorage.setItem("admin_orders_data", JSON.stringify(mapped));
        }
        return mapped;
      }
    } catch (e) {
      console.warn("Gagal fetch orders dari Supabase:", e);
    }
  }

  // Fallback ke localStorage
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("admin_orders_data");
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
  }

  return [];
}

export async function updateLiveOrderStatus(orderId: string, status: string): Promise<{ error: any }> {
  const client = createClient();
  if (!client) return { error: new Error("Supabase tidak aktif") };
  try {
    const { error } = await client
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .or(`id.eq.${orderId},order_number.eq.${orderId}`);
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}
