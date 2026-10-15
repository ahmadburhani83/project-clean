"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { MOCK_PRODUCTS, MOCK_PARTNERS, CATEGORIES_LIST } from "@/lib/mock-data";
import { SUPABASE_SCHEMA_SQL, SUPABASE_SEED_SQL, SUPABASE_FIX_RLS_SQL } from "@/lib/supabase/schema-sql";
import { saveStoreProfile, fetchStoreProfile, fetchLiveOrders, updateLiveOrderStatus } from "@/lib/supabase/data-service";
import { formatRupiah } from "@/lib/utils";
import { Product, PartnerStore, HazardLevel, ProductCategory, ProductVariant } from "@/types/store.types";
import { HazardBadge } from "@/components/product/HazardBadge";
import { 
  LayoutDashboard, 
  Package, 
  Store, 
  ClipboardList, 
  Settings, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Database, 
  ExternalLink,
  ShieldAlert,
  Download,
  Phone,
  Clock,
  Sparkles,
  FlaskConical,
  X,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Building,
  Save,
  Check,
  MapPin
} from "lucide-react";

export default function AdminDashboardPage() {
  // ==========================================================
  // 1. SISTEM AUTENTIKASI KATA SANDI (SECURITY GATE)
  // ==========================================================
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [adminPassword, setAdminPassword] = useState("admin123");

  // Load password & auth state from storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPw = localStorage.getItem("admin_custom_password");
      if (storedPw) {
        setAdminPassword(storedPw);
      }
      const isAuth = sessionStorage.getItem("admin_session_auth");
      if (isAuth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_session_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Kata sandi salah. Silakan periksa kembali kata sandi administrator Anda.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_session_auth");
    setPasswordInput("");
  };

  // ==========================================================
  // 2. STATE PERSISTENSI MASTER DATA & TOKO
  // ==========================================================
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "partners" | "orders" | "safety" | "store_settings" | "supabase_connect">("supabase_connect");

  // State Supabase Connection & Setup
  const [supabaseUrlInput, setSupabaseUrlInput] = useState("");
  const [supabaseKeyInput, setSupabaseKeyInput] = useState("");
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<"idle" | "testing" | "success" | "error_table" | "error_auth">("idle");
  const [supabaseMessage, setSupabaseMessage] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState("");
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedSeedSql, setCopiedSeedSql] = useState(false);
  const [copiedRlsSql, setCopiedRlsSql] = useState(false);

  // Profil Toko Pusat (Dapat diedit semua)
  const [storeProfile, setStoreProfile] = useState({
    storeName: "KIMIA NUSANTARA",
    tagline: "Toko Kimia & Produk Rumah Tangga",
    topBannerText: "Pesan bahan kimia & produk rumah tangga lewat Mitra Terdekat di Kota Anda untuk hemat ongkir!",
    centralWarehouseAddress: "Kawasan Industri Cikupa Mas Blok B-12, Tangerang, Banten",
    hotlineWhatsApp: "081234567890",
    supportEmail: "support@kimianusantara.id",
    cargoNotes: "Pengiriman luar kota menggunakan armada kargo khusus cairan bersegel.",
  });

  // State Produk Master
  const [productsList, setProductsList] = useState<Product[]>(MOCK_PRODUCTS);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");

  // State Modal Tambah & Edit Produk
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // State Modal Tambah & Edit Mitra
  const [partnersList, setPartnersList] = useState<PartnerStore[]>(MOCK_PARTNERS);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerStore | null>(null);

  // State Pesanan
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
  ]);

  const [orderFilterPartner, setOrderFilterPartner] = useState("all");
  const [orderFilterStatus, setOrderFilterStatus] = useState("all");

  // Helper Client Supabase Aktif
  const getActiveSupabaseClient = () => {
    const url = supabaseUrlInput.trim() || (typeof window !== "undefined" ? localStorage.getItem("custom_supabase_url") : null) || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = supabaseKeyInput.trim() || (typeof window !== "undefined" ? localStorage.getItem("custom_supabase_key") : null) || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    if (url && key) {
      try {
        return createBrowserClient(url, key);
      } catch {
        return null;
      }
    }
    return null;
  };

  // 1. Ambil data Toko Mitra langsung dari Supabase
  const fetchPartnersFromSupabase = async (client: any) => {
    try {
      const { data, error } = await client.from("partners").select("*").order("name", { ascending: true });
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
        setPartnersList(mapped);
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_partners_data", JSON.stringify(mapped));
        }
      }
    } catch (e) {
      console.error("Error fetching partners from Supabase:", e);
    }
  };

  // 2. Ambil data Produk & Varian langsung dari Supabase
  const fetchProductsFromSupabase = async (client: any) => {
    try {
      const { data, error } = await client.from("products").select("*, product_variants(*)").order("created_at", { ascending: false });
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
        setProductsList(mapped);
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_products_data", JSON.stringify(mapped));
        }
      }
    } catch (e) {
      console.error("Error fetching products from Supabase:", e);
    }
  };

  // Load persistent data from localStorage & Supabase
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProducts = localStorage.getItem("admin_products_data");
      if (savedProducts) {
        try { setProductsList(JSON.parse(savedProducts)); } catch {}
      }
      const savedPartners = localStorage.getItem("admin_partners_data");
      if (savedPartners) {
        try { setPartnersList(JSON.parse(savedPartners)); } catch {}
      }
      const savedStore = localStorage.getItem("admin_store_profile");
      if (savedStore) {
        try { setStoreProfile(JSON.parse(savedStore)); } catch {}
      }
      const storedUrl = localStorage.getItem("custom_supabase_url") || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const storedKey = localStorage.getItem("custom_supabase_key") || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
      setSupabaseUrlInput(storedUrl);
      setSupabaseKeyInput(storedKey);
      if (storedUrl && storedKey) {
        setSupabaseTestStatus("success");
        setSupabaseMessage("Koneksi Supabase tersimpan!");
        try {
          const client = createBrowserClient(storedUrl, storedKey);
          fetchPartnersFromSupabase(client);
          fetchProductsFromSupabase(client);
        } catch {}
      }

      // Selalu muat profil toko & pesanan dari Supabase / LocalStorage
      fetchStoreProfile().then(setStoreProfile);
      fetchLiveOrders().then((ords) => {
        if (ords && ords.length > 0) setOrdersList(ords);
      });
    }
  }, []);

  const handleTestSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = supabaseUrlInput.trim();
    const cleanKey = supabaseKeyInput.trim();

    if (!cleanUrl || !cleanKey) {
      alert("Mohon masukkan Project URL dan Anon Key Supabase Anda.");
      return;
    }

    setSupabaseTestStatus("testing");
    setSupabaseMessage("Menghubungi server Supabase...");

    try {
      const client = createBrowserClient(cleanUrl, cleanKey);
      const { data, error } = await client.from("products").select("id, name").limit(5);

      if (error) {
        if (error.message.includes("does not exist") || error.code === "42P01") {
          setSupabaseTestStatus("error_table");
          setSupabaseMessage("Koneksi ke Supabase berhasil! Namun tabel 'products' belum dibuat di database Anda. Silakan jalankan kode SQL schema di bawah.");
          localStorage.setItem("custom_supabase_url", cleanUrl);
          localStorage.setItem("custom_supabase_key", cleanKey);
        } else {
          setSupabaseTestStatus("error_auth");
          setSupabaseMessage("Gagal tersambung: " + error.message);
        }
      } else {
        setSupabaseTestStatus("success");
        setSupabaseMessage(`Berhasil terhubung ke Supabase! Database aktif dan ditemukan ${data?.length || 0} produk.`);
        localStorage.setItem("custom_supabase_url", cleanUrl);
        localStorage.setItem("custom_supabase_key", cleanKey);
        fetchPartnersFromSupabase(client);
        fetchProductsFromSupabase(client);
        fetchStoreProfile().then(setStoreProfile);
        fetchLiveOrders().then((ords) => {
          if (ords && ords.length > 0) setOrdersList(ords);
        });
      }
    } catch (err: any) {
      setSupabaseTestStatus("error_auth");
      setSupabaseMessage("Kesalahan koneksi: " + (err?.message || "Periksa kembali Project URL dan Anon Key"));
    }
  };

  const handleCopySql = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    }
  };

  const handleCopySeedSql = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(SUPABASE_SEED_SQL);
      setCopiedSeedSql(true);
      setTimeout(() => setCopiedSeedSql(false), 3000);
    }
  };

  const handleCopyRlsSql = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(SUPABASE_FIX_RLS_SQL);
      setCopiedRlsSql(true);
      setTimeout(() => setCopiedRlsSql(false), 3000);
    }
  };

  const handleSyncDataToSupabase = async () => {
    const cleanUrl = supabaseUrlInput.trim();
    const cleanKey = supabaseKeyInput.trim();
    if (!cleanUrl || !cleanKey) {
      alert("Masukkan dan simpan Project URL dan Anon Key terlebih dahulu.");
      return;
    }

    setIsSyncing(true);
    setSyncProgress("Memulai proses upload master data ke Supabase...");

    try {
      const client = createBrowserClient(cleanUrl, cleanKey);

      // 1. Upload Kategori
      setSyncProgress("1/4 Mengunggah master kategori produk...");
      const categoriesData = [
        { id: "11111111-1111-1111-1111-111111111101", name: "Kimia Rumah Tangga", slug: "rumah-tangga", description: "Pembersih rumah tangga", display_order: 1 },
        { id: "11111111-1111-1111-1111-111111111102", name: "Kimia Laundry", slug: "laundry", description: "Pembersih laundry", display_order: 2 },
        { id: "11111111-1111-1111-1111-111111111103", name: "Bahan Kimia Teknis", slug: "industri", description: "Bahan baku kimia mentah", display_order: 3 },
        { id: "11111111-1111-1111-1111-111111111104", name: "Aroma & Bibit Parfum", slug: "aroma-bibit", description: "Bibit parfum murni", display_order: 4 },
        { id: "11111111-1111-1111-1111-111111111105", name: "Kemasan & Wadah", slug: "kemasan", description: "Jerigen dan botol", display_order: 5 }
      ];
      const { error: catErr } = await client.from("categories").upsert(categoriesData, { onConflict: "slug" });
      if (catErr) {
        throw new Error("Gagal mengunggah kategori: " + catErr.message);
      }

      // 2. Upload Mitra Daerah
      setSyncProgress("2/4 Mengunggah jaringan mitra daerah...");
      for (const partner of partnersList) {
        const { error: partErr } = await client.from("partners").upsert({
          name: partner.name,
          slug: partner.slug,
          owner_name: partner.ownerName,
          phone: partner.phone,
          whatsapp: partner.whatsapp,
          address: partner.address,
          city: partner.city,
          province: partner.province,
          district: partner.district,
          latitude: partner.latitude,
          longitude: partner.longitude,
          service_radius_km: partner.serviceRadiusKm,
          operational_hours: partner.operationalHours,
          supports_pickup: partner.supportsPickup,
          supports_local_delivery: partner.supportsLocalDelivery,
          is_active: true
        }, { onConflict: "slug" });

        if (partErr) {
          throw new Error(`Gagal mengunggah mitra "${partner.name}": ${partErr.message}`);
        }
      }

      // 3. Upload Produk Kimia & Produk Rumah Tangga
      setSyncProgress(`3/4 Mengunggah ${productsList.length} produk kimia & rumah tangga...`);
      const catMap: Record<string, string> = {
        "rumah-tangga": "11111111-1111-1111-1111-111111111101",
        "laundry": "11111111-1111-1111-1111-111111111102",
        "industri": "11111111-1111-1111-1111-111111111103",
        "aroma-bibit": "11111111-1111-1111-1111-111111111104",
        "kemasan": "11111111-1111-1111-1111-111111111105",
      };

      for (const prod of productsList) {
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

        if (prodErr) {
          throw new Error(`Gagal mengunggah produk "${prod.name}": ${prodErr.message}`);
        }

        // 4. Upload Varian Produk
        const productId = upsertedProduct?.id;
        if (productId && prod.variants && prod.variants.length > 0) {
          for (const v of prod.variants) {
            const { error: varErr } = await client.from("product_variants").upsert({
              product_id: productId,
              sku: v.sku,
              unit_name: v.unitName,
              base_price: v.basePrice,
              retail_price: v.retailPrice,
              weight_grams: v.weightGrams,
              is_active: true
            }, { onConflict: "sku" });

            if (varErr) {
              console.warn("Varian upload warning:", varErr.message);
            }
          }
        }
      }

      setSyncProgress("4/4 ✅ Selesai! Seluruh produk, varian kemasan, kategori & mitra sukses tersimpan di database Supabase!");
      alert("Alhamdulillah! Seluruh master produk, varian, dan mitra daerah telah berhasil masuk ke database Supabase Anda.");
      fetchPartnersFromSupabase(client);
      fetchProductsFromSupabase(client);
    } catch (err: any) {
      setSyncProgress("Gagal: " + (err?.message || "Terjadi kesalahan saat upload"));
      alert("Upload gagal: " + err?.message + "\n\nPastikan Anda sudah menjalankan 'Salin SQL Izin Simpan (RLS Fix)' di SQL Editor Supabase.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Simpan data setiap ada perubahan
  const saveProductsToStorage = (updated: Product[]) => {
    setProductsList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_products_data", JSON.stringify(updated));
    }
  };

  const savePartnersToStorage = (updated: PartnerStore[]) => {
    setPartnersList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_partners_data", JSON.stringify(updated));
    }
  };

  const saveStoreProfileToStorage = (updated: typeof storeProfile) => {
    setStoreProfile(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_store_profile", JSON.stringify(updated));
    }
  };

  // ==========================================================
  // 3. HANDLER OPERASI EDIT & TAMBAH PRODUK (DENGAN SUPABASE REAL-TIME)
  // ==========================================================
  const handleSaveProduct = async (productData: Product) => {
    const existingIdx = productsList.findIndex((p) => p.id === productData.id);
    let updated: Product[];
    if (existingIdx > -1) {
      updated = [...productsList];
      updated[existingIdx] = productData;
    } else {
      updated = [productData, ...productsList];
    }
    saveProductsToStorage(updated);
    setIsAddProductModalOpen(false);
    setEditingProduct(null);

    // Kirim langsung ke Database Supabase
    const client = getActiveSupabaseClient();
    if (!client) {
      alert("⚠️ PERHATIAN: Supabase Belum Terhubung!\n\nProduk berhasil tersimpan di browser ini. Karena Project URL & Anon Key belum diisi, produk BELUM masuk ke database Supabase.\n\n👉 Buka tab 'Koneksi Supabase' di panel admin untuk menghubungkan.");
      return;
    }

    try {
      const catMap: Record<string, string> = {
        "rumah-tangga": "11111111-1111-1111-1111-111111111101",
        "laundry": "11111111-1111-1111-1111-111111111102",
        "industri": "11111111-1111-1111-1111-111111111103",
        "aroma-bibit": "11111111-1111-1111-1111-111111111104",
        "kemasan": "11111111-1111-1111-1111-111111111105",
      };
      const categoryId = catMap[productData.category] || "11111111-1111-1111-1111-111111111101";

      const { data: upsertedProduct, error: prodErr } = await client.from("products").upsert({
        name: productData.name,
        slug: productData.slug,
        category_id: categoryId,
        description: productData.description,
        features: productData.features || [],
        safety_guidelines: productData.safetyGuidelines || "",
        hazard_level: productData.hazardLevel || "aman",
        msds_url: productData.msdsUrl || null,
        is_household_chemical: productData.isHouseholdChemical !== false,
        image_url: productData.image,
        is_active: true
      }, { onConflict: "slug" }).select("id").single();

      if (prodErr) {
        console.error("Gagal simpan produk ke Supabase:", prodErr);
        alert(
          `❌ GAGAL SIMPAN KE SUPABASE:\n${prodErr.message}\n\n` +
          (prodErr.message.includes("policy") || prodErr.code === "42501"
            ? "👉 Supabase memblokir izin simpan (RLS). Buka tab 'Koneksi Supabase', klik 'Salin SQL Izin Simpan (RLS Fix)', lalu RUN di SQL Editor Supabase."
            : "Periksa kembali tabel database Anda.")
        );
      } else if (upsertedProduct?.id && productData.variants) {
        for (const v of productData.variants) {
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
        alert(`✅ ALHAMDULILLAH BERHASIL!\n\nProduk "${productData.name}" dan seluruh varian kemasannya berhasil langsung masuk ke database Supabase!`);
        fetchProductsFromSupabase(client);
      }
    } catch (err: any) {
      console.error("Error saving product to Supabase:", err);
      alert("Terjadi kesalahan: " + (err?.message || "Koneksi terputus"));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const prodToDelete = productsList.find((p) => p.id === id);
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${prodToDelete?.name || id}"?`)) {
      return;
    }

    const updated = productsList.filter((p) => p.id !== id);
    saveProductsToStorage(updated);

    const client = getActiveSupabaseClient();
    if (client && prodToDelete) {
      try {
        const { error } = await client.from("products").delete().eq("slug", prodToDelete.slug);
        if (error) {
          alert("Gagal menghapus produk dari Supabase: " + error.message);
        } else {
          alert(`Produk "${prodToDelete.name}" telah dihapus dari Supabase.`);
          fetchProductsFromSupabase(client);
        }
      } catch (err) {
        console.error("Error deleting product from Supabase:", err);
      }
    }
  };

  // ==========================================================
  // 4. HANDLER OPERASI EDIT & TAMBAH MITRA (DENGAN SUPABASE REAL-TIME)
  // ==========================================================
  const handleSavePartner = async (partnerData: PartnerStore) => {
    const existingIdx = partnersList.findIndex((m) => m.id === partnerData.id);
    let updated: PartnerStore[];
    if (existingIdx > -1) {
      updated = [...partnersList];
      updated[existingIdx] = partnerData;
    } else {
      updated = [...partnersList, partnerData];
    }
    savePartnersToStorage(updated);
    setIsAddPartnerModalOpen(false);
    setEditingPartner(null);

    // Langsung simpan / upsert ke database Supabase
    const client = getActiveSupabaseClient();
    if (!client) {
      alert("⚠️ PERHATIAN: Supabase Belum Terhubung!\n\nData toko mitra berhasil tersimpan di browser ini. Karena Project URL & Anon Key belum diisi atau belum dihubungkan, data BELUM masuk ke database Supabase.\n\n👉 Silakan buka tab 'Koneksi Supabase' di panel admin untuk menghubungkan.");
      return;
    }

    try {
      const payload: any = {
        name: partnerData.name,
        slug: partnerData.slug,
        owner_name: partnerData.ownerName,
        phone: partnerData.phone,
        whatsapp: partnerData.whatsapp,
        address: partnerData.address,
        city: partnerData.city,
        province: partnerData.province || "Jawa Barat",
        district: partnerData.district || partnerData.city,
        latitude: Number(partnerData.latitude) || -6.2088,
        longitude: Number(partnerData.longitude) || 106.8456,
        service_radius_km: Number(partnerData.serviceRadiusKm) || 25,
        rating: partnerData.rating || 5.0,
        review_count: partnerData.reviewCount || 0,
        operational_hours: partnerData.operationalHours || "Senin - Sabtu: 08.00 - 17.00 WIB",
        supports_pickup: partnerData.supportsPickup ?? true,
        supports_local_delivery: partnerData.supportsLocalDelivery ?? true,
        is_active: true
      };

      const { data, error } = await client.from("partners").upsert(payload, { onConflict: "slug" }).select().single();

      if (error) {
        console.error("Gagal simpan mitra ke Supabase:", error);
        alert(
          `❌ GAGAL MASUK KE SUPABASE:\n${error.message}\n\n` +
          (error.message.includes("policy") || error.code === "42501"
            ? "👉 PENYEBAB: Supabase Anda memblokir izin simpan (Row Level Security).\n\nSOLUSI: Buka tab 'Koneksi Supabase' di panel admin, klik tombol 'Salin SQL Izin Simpan (RLS Fix)', lalu jalankan (RUN) di menu SQL Editor Supabase."
            : "Periksa kembali tabel database 'partners' di dashboard Supabase Anda.")
        );
      } else {
        alert(`✅ ALHAMDULILLAH BERHASIL!\n\nToko Mitra "${partnerData.name}" berhasil langsung masuk ke database Supabase!`);
        fetchPartnersFromSupabase(client);
      }
    } catch (err: any) {
      console.error("Error saving partner to Supabase:", err);
      alert("Terjadi kesalahan koneksi: " + (err?.message || "Koneksi terputus"));
    }
  };

  const handleDeletePartner = async (id: string) => {
    const partnerToDelete = partnersList.find((m) => m.id === id);
    if (!confirm(`Apakah Anda yakin ingin menghapus toko mitra "${partnerToDelete?.name || id}"?`)) {
      return;
    }

    const updated = partnersList.filter((m) => m.id !== id);
    savePartnersToStorage(updated);

    const client = getActiveSupabaseClient();
    if (client && partnerToDelete) {
      try {
        const { error } = await client.from("partners").delete().eq("slug", partnerToDelete.slug);
        if (error) {
          alert("Gagal menghapus dari Supabase: " + error.message);
        } else {
          alert(`Toko mitra "${partnerToDelete.name}" telah dihapus dari Supabase.`);
          fetchPartnersFromSupabase(client);
        }
      } catch (err: any) {
        console.error("Error deleting partner from Supabase:", err);
      }
    }
  };

  // Ganti Password Admin
  const [newPasswordForm, setNewPasswordForm] = useState({ old: "", newPass: "", confirm: "" });
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordForm.old !== adminPassword) {
      alert("Kata sandi lama salah.");
      return;
    }
    if (newPasswordForm.newPass.length < 6) {
      alert("Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (newPasswordForm.newPass !== newPasswordForm.confirm) {
      alert("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setAdminPassword(newPasswordForm.newPass);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_custom_password", newPasswordForm.newPass);
    }
    setPasswordChangeSuccess(true);
    setNewPasswordForm({ old: "", newPass: "", confirm: "" });
    setTimeout(() => setPasswordChangeSuccess(false), 3000);
  };

  const handleUpdateOrderStatus = async (orderNumber: string, newStatus: string) => {
    const updated = ordersList.map((o) => o.orderNumber === orderNumber ? { ...o, status: newStatus } : o);
    setOrdersList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_orders_data", JSON.stringify(updated));
    }

    try {
      await updateLiveOrderStatus(orderNumber, newStatus);
    } catch (err) {
      console.warn("Gagal update status order ke Supabase:", err);
    }
  };

  // Filter Data
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchCat = productCategoryFilter === "all" || p.category === productCategoryFilter;
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.categoryLabel.toLowerCase().includes(productSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [productsList, productCategoryFilter, productSearch]);

  const filteredPartners = useMemo(() => {
    return partnersList.filter((m) =>
      m.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      m.city.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      m.province.toLowerCase().includes(partnerSearch.toLowerCase())
    );
  }, [partnersList, partnerSearch]);

  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      const matchPartner = orderFilterPartner === "all" || o.partnerName === orderFilterPartner;
      const matchStatus = orderFilterStatus === "all" || o.status === orderFilterStatus;
      return matchPartner && matchStatus;
    });
  }, [ordersList, orderFilterPartner, orderFilterStatus]);

  // Metrik
  const totalOmset = ordersList.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalPesanan = ordersList.length;
  const totalMitraAktif = partnersList.length;
  const totalSKU = productsList.reduce((acc, p) => acc + p.variants.length, 0);

  // ==========================================================
  // JIKA BELUM LOGIN: TAMPILKAN FORM LOGIN PASSWORD
  // ==========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
          
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {storeProfile.storeName}
              </span>
              <h1 className="text-2xl font-black text-white mt-1">
                Panel Super Admin
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Masukkan kata sandi administrator untuk mengelola seluruh data produk, mitra, dan pesanan.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Kata Sandi Administrator *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan kata sandi admin..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError("");
                  }}
                  className="w-full pl-4 pr-11 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Masuk ke Panel Admin</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Password Default: <strong className="text-slate-300 font-mono">admin123</strong></span>
            <Link href="/" className="text-blue-400 hover:underline">
              ← Kembali ke Beranda
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================================
  // JIKA SUDAH LOGIN: TAMPILKAN DASHBOARD LENGKAP
  // ==========================================================
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* HEADER UTAMA ADMIN */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-tight text-white">
                {storeProfile.storeName}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Panel Pengendali Terpusat • Semua Data Dapat Diedit Langsung
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("supabase_connect")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              supabaseTestStatus === "success"
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-700"
                : "bg-amber-950/80 text-amber-300 border-amber-700"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{supabaseTestStatus === "success" ? "🟢 Supabase Terhubung" : "⚡ Hubungkan Supabase"}</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors border border-slate-700"
          >
            <span>Tinjau Website Depan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/80 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Keluar & Kunci Panel Admin"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Kunci / Keluar</span>
          </button>
        </div>
      </header>

      {/* CONTAINER ADMIN */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* SIDEBAR ADMIN */}
        <aside className="w-full md:w-64 bg-slate-950/70 border-r border-slate-800 p-4 space-y-6 shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Navigasi Admin
            </span>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("supabase_connect")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === "supabase_connect"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-emerald-400 hover:text-white hover:bg-slate-800/60 border border-emerald-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4" />
                  <span>Koneksi Supabase</span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  Setup
                </span>
              </button>

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
                  <span>Edit Produk & Kimia</span>
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
                  <span>Edit Mitra Daerah</span>
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
                  <span>Pesanan Nasional</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  {ordersList.filter((o) => o.status === "pending").length} baru
                </span>
              </button>

              <button
                onClick={() => setActiveTab("store_settings")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === "store_settings"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Edit Profil Toko Pusat</span>
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
                <span>Kepatuhan & APD</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* AREA KONTEN UTAMA */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* TAB 0: KONEKSI SUPABASE (ASSISTANT & SETUP WIZARD) */}
          {activeTab === "supabase_connect" && (
            <div className="space-y-6 animate-in fade-in max-w-4xl">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 mb-2">
                  <Database className="w-3.5 h-3.5" /> Panduan & Pengujian Database Supabase
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Hubungkan Database Supabase (Mudah & Cepat)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Ikuti 3 langkah praktis di bawah agar website Anda terhubung langsung ke basis data cloud Supabase.
                </p>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                supabaseTestStatus === "success"
                  ? "bg-emerald-950/40 border-emerald-700/80 text-emerald-300"
                  : supabaseTestStatus === "error_table"
                  ? "bg-amber-950/40 border-amber-700/80 text-amber-300"
                  : supabaseTestStatus === "error_auth"
                  ? "bg-red-950/40 border-red-700/80 text-red-300"
                  : "bg-blue-950/40 border-blue-700/80 text-blue-300"
              }`}>
                <div className="p-2 rounded-xl bg-slate-900 shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-xs flex-1">
                  <span className="font-bold block text-sm">
                    {supabaseTestStatus === "success"
                      ? "🟢 Database Supabase Aktif & Terhubung!"
                      : supabaseTestStatus === "error_table"
                      ? "🟡 Koneksi Berhasil, Tetapi Tabel Belum Dibuat!"
                      : supabaseTestStatus === "error_auth"
                      ? "🔴 Gagal Menghubungi Supabase"
                      : "⚪ Masukkan Project URL & Anon Key Supabase Anda"}
                  </span>
                  <p className="leading-relaxed">
                    {supabaseMessage || "Website saat ini siap dihubungkan. Masukkan URL dan Key dari dashboard Supabase Anda di bawah."}
                  </p>
                </div>
              </div>

              {/* LANGKAH 1: FORM INPUT KUNCI API */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">1</span>
                  <h3 className="font-bold text-sm text-white">Masukkan Kunci API Supabase Anda</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Buka <strong>supabase.com</strong> ➔ Klik ikon gerigi <strong>Project Settings</strong> (di pojok kiri bawah) ➔ pilih menu <strong>API</strong>.
                </p>

                <form onSubmit={handleTestSupabase} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Project URL *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: https://xyzcompany.supabase.co"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Project API Key (bagian "anon" "public") *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Contoh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono text-[11px]"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={supabaseTestStatus === "testing"}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
                    >
                      <Database className="w-4 h-4" />
                      <span>{supabaseTestStatus === "testing" ? "Sedang Menguji..." : "🔍 Tes & Simpan Koneksi Supabase Sekarang"}</span>
                    </button>
                    <span className="text-[11px] text-slate-400">
                      (Kunci otomatis tersimpan di peramban untuk website ini)
                    </span>
                  </div>
                </form>
              </div>

              {/* LANGKAH 2: SALIN KODE SQL SKEMA TABEL */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">2</span>
                  <h3 className="font-bold text-sm text-white">Buat Tabel Database (1-Klik Salin SQL)</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Jika tabel database belum ada di Supabase Anda, klik tombol di bawah untuk menyalin seluruh skema (tabel produk, varian, mitra, order, dan rumus GPS Haversine). Buka menu <strong>SQL Editor</strong> di Supabase ➔ Paste ➔ Klik <strong>RUN</strong>.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={handleCopySql}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>{copiedSql ? "✅ Kode SQL Schema Berhasil Disalin!" : "📋 Salin Seluruh Kode SQL Schema Supabase"}</span>
                  </button>

                  <button
                    onClick={handleCopySeedSql}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    <span>{copiedSeedSql ? "✅ SQL Data Produk & Mitra Disalin!" : "📦 Salin SQL Isi Produk & Mitra (Seed Data)"}</span>
                  </button>

                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Buka Dashboard Supabase</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* LANGKAH PENTING: IZIN SIMPAN (ROW LEVEL SECURITY / RLS FIX) */}
              <div className="bg-amber-950/40 border border-amber-500/40 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center font-bold text-xs text-slate-900">!</span>
                  <h3 className="font-bold text-sm text-amber-300">Izin Simpan Database (Wajib Dijalankan Sekali di Supabase)</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Secara default, Supabase memproteksi tabel agar tidak bisa ditambahi data sembarangan (Row Level Security). Jika Anda mengalami error saat <strong>menambah toko mitra</strong> atau <strong>produk baru</strong>, klik tombol di bawah untuk menyalin kode izin, lalu jalankan di <strong>SQL Editor</strong> Supabase:
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={handleCopyRlsSql}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{copiedRlsSql ? "✅ SQL Izin Simpan Berhasil Disalin!" : "📋 Salin SQL Izin Simpan Mitra & Produk (RLS Fix)"}</span>
                  </button>

                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Buka SQL Editor Supabase</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* LANGKAH 3: SINKRONISASI DATA KE SUPABASE */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">3</span>
                  <h3 className="font-bold text-sm text-white">Upload & Sinkronkan Data Awal ke Supabase</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Setelah tabel di Supabase siap, Anda dapat langsung mengunggah data kategori produk dan data toko mitra daerah dari website ini ke database Supabase hanya dengan 1 klik:
                </p>

                <div className="space-y-3 pt-1">
                  <button
                    onClick={handleSyncDataToSupabase}
                    disabled={isSyncing}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 rotate-180" />
                    <span>{isSyncing ? "Sedang Mengunggah..." : "🚀 Upload Otomatis Semua Data ke Database Supabase"}</span>
                  </button>

                  {syncProgress && (
                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-cyan-300 animate-in fade-in">
                      {syncProgress}
                    </div>
                  )}
                </div>
              </div>

              {/* FAQ BANTUAN */}
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/60 text-xs text-slate-400 space-y-2">
                <span className="font-bold text-slate-200 block">💡 Mengapa Vercel Membutuhkan Variabel Ini?</span>
                <p>
                  Vercel membaca <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di menu <em>Project Settings ➔ Environment Variables</em>. Dengan fitur di atas, website Anda juga otomatis menyimpannya di browser sehingga Anda dapat langsung menggunakannya tanpa harus menunggu redeploy!
                </p>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Banner Supabase Database Shortcut */}
              <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-900 border border-emerald-600/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">Status Koneksi Supabase Database</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${supabaseTestStatus === "success" ? "bg-emerald-900 text-emerald-300 border border-emerald-700" : "bg-amber-900/80 text-amber-300 border border-amber-700"}`}>
                        {supabaseTestStatus === "success" ? "TERHUBUNG" : "SETUP DIBUTUHKAN"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {supabaseTestStatus === "success"
                        ? "✅ Database Supabase aktif dan siap digunakan untuk transaksi produk & mitra."
                        : "Klik tombol hijau di samping untuk menghubungkan Project URL & Anon Key Supabase tanpa coding!"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("supabase_connect")}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  <span>Buka Menu Supabase ➔</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Ringkasan Toko & Distribusi Nasional
                  </h2>
                  <p className="text-xs text-slate-400">
                    Sistem kendali terpusat {storeProfile.storeName}.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("store_settings")}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 self-start sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Nama Toko & Hotline</span>
                </button>
              </div>

              {/* 4 Kartu Metrik */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <span className="text-xs font-bold text-slate-400">Total Omset Nasional</span>
                  <p className="text-2xl font-black text-white">{formatRupiah(totalOmset)}</p>
                  <span className="text-[11px] text-emerald-400 font-semibold block">Akumulasi seluruh mitra</span>
                </div>
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <span className="text-xs font-bold text-slate-400">Total Pesanan</span>
                  <p className="text-2xl font-black text-white">{totalPesanan} Pesanan</p>
                  <span className="text-[11px] text-blue-400 font-semibold block">Ambil di toko & kurir lokal</span>
                </div>
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <span className="text-xs font-bold text-slate-400">Mitra Daerah Aktif</span>
                  <p className="text-2xl font-black text-white">{totalMitraAktif} Toko</p>
                  <span className="text-[11px] text-purple-400 font-semibold block">Jaringan titik pemenuhan</span>
                </div>
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
                  <span className="text-xs font-bold text-slate-400">Total Varian Produk</span>
                  <p className="text-2xl font-black text-white">{totalSKU} Varian</p>
                  <span className="text-[11px] text-amber-400 font-semibold block">1L, 5L, 20L, 25Kg</span>
                </div>
              </div>

              {/* Banner Info Toko Pusat */}
              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
                <span className="font-bold text-slate-300 block">Keterangan Profil Toko Pusat Saat Ini:</span>
                <p>• Nama Toko: <strong>{storeProfile.storeName}</strong> ({storeProfile.tagline})</p>
                <p>• Teks Banner: <em>"{storeProfile.topBannerText}"</em></p>
                <p>• Hotline WhatsApp: <strong>{storeProfile.hotlineWhatsApp}</strong> • Email: <strong>{storeProfile.supportEmail}</strong></p>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PRODUK & BAHAN KIMIA */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Kelola & Edit Master Produk Kimia</h2>
                  <p className="text-xs text-slate-400">Edit nama, harga, varian kemasan, tingkat bahaya GHS, dan foto produk.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddProductModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Produk Baru</span>
                </button>
              </div>

              {/* Status Banner Supabase Produk */}
              {supabaseTestStatus === "success" || getActiveSupabaseClient() ? (
                <div className="bg-emerald-950/70 border border-emerald-600/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">Supabase Terhubung: Real-Time Sync Aktif</span>
                      <p className="text-emerald-300 text-[11px]">Setiap produk dan varian yang disimpan otomatis langsung masuk ke database Supabase.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        const client = getActiveSupabaseClient();
                        if (client) {
                          fetchProductsFromSupabase(client);
                          alert("Data produk berhasil disegarkan dari database Supabase!");
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>🔄 Segarkan Produk Supabase</span>
                    </button>
                    <button
                      onClick={handleCopyRlsSql}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1 cursor-pointer border border-slate-600 transition-colors"
                      title="Salin SQL jika Supabase menolak simpan data"
                    >
                      <span>{copiedRlsSql ? "✅ SQL Disalin!" : "📋 SQL Izin Simpan (RLS Fix)"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-950/80 border border-amber-600/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">Perhatian: Database Supabase Belum Terhubung!</span>
                      <p className="text-amber-200 text-[11px]">Produk yang Anda tambah saat ini hanya tersimpan di memori browser ini dan belum masuk ke Supabase.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("supabase_connect")}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shrink-0 cursor-pointer shadow-md transition-colors"
                  >
                    Hubungkan Supabase Sekarang ➔
                  </button>
                </div>
              )}

              {/* Bar Filter */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama produk kimia atau pembersih..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-hidden"
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

              {/* Tabel List Produk dengan Tombol EDIT */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden divide-y divide-slate-700/60">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-750 transition-colors">
                    <div className="flex items-center gap-4">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-16 object-cover rounded-xl bg-slate-900 shrink-0 border border-slate-700"
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
                        <p className="text-[11px] text-slate-500">
                          Varian: {prod.variants.map((v) => `${v.unitName} (${formatRupiah(v.retailPrice)})`).join(" • ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-700 shrink-0">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsAddProductModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border border-blue-500/30"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Produk</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EDIT MITRA DAERAH */}
          {activeTab === "partners" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Kelola & Edit Toko Mitra Daerah</h2>
                  <p className="text-xs text-slate-400">Edit nama toko mitra, penanggung jawab, kontak WhatsApp, alamat, dan radius layanan.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingPartner(null);
                    setIsAddPartnerModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Daftarkan Mitra Baru</span>
                </button>
              </div>

              {/* Status Banner Supabase untuk Mitra */}
              {supabaseTestStatus === "success" || getActiveSupabaseClient() ? (
                <div className="bg-emerald-950/70 border border-emerald-600/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">Database Supabase Terhubung Aktif</span>
                      <p className="text-emerald-300 text-[11px]">Setiap kali Anda menambah, mengedit, atau menghapus toko mitra di bawah, data langsung tersinkronisasi ke cloud database Supabase.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        const client = getActiveSupabaseClient();
                        if (client) {
                          fetchPartnersFromSupabase(client);
                          alert("Data mitra berhasil disegarkan dari database Supabase!");
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <span>🔄 Segarkan dari Supabase</span>
                    </button>
                    <button
                      onClick={handleCopyRlsSql}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1 cursor-pointer border border-slate-600 transition-colors"
                      title="Salin SQL jika Supabase menolak simpan data"
                    >
                      <span>{copiedRlsSql ? "✅ SQL Disalin!" : "📋 SQL Izin Simpan (RLS Fix)"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-950/80 border border-amber-600/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">Perhatian: Database Supabase Belum Terhubung!</span>
                      <p className="text-amber-200 text-[11px]">Toko mitra yang Anda tambah saat ini hanya tersimpan di memori browser ini dan belum masuk ke Supabase.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("supabase_connect")}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shrink-0 cursor-pointer shadow-md transition-colors"
                  >
                    Hubungkan Supabase Sekarang ➔
                  </button>
                </div>
              )}

              {/* Bar Filter */}
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

              {/* Grid Kartu Mitra dengan Tombol EDIT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPartners.map((partner) => (
                  <div key={partner.id} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
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

                      <p className="text-xs text-slate-400 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>{partner.address}, Kec. {partner.district}</span>
                      </p>

                      <div className="space-y-1 text-xs text-slate-300 pt-1">
                        <p>WhatsApp: <strong>{partner.whatsapp}</strong> • Jam: {partner.operationalHours}</p>
                        <p>Radius Layanan: <strong>{partner.serviceRadiusKm} km</strong> • GPS: {partner.latitude}, {partner.longitude}</p>
                        <p className="text-[11px] text-slate-400">
                          Layanan: {partner.supportsPickup ? "✓ Ambil di Toko" : ""} • {partner.supportsLocalDelivery ? "✓ Kurir Lokal" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-700 text-xs">
                      <button
                        onClick={() => {
                          setEditingPartner(partner);
                          setIsAddPartnerModalOpen(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-xl font-bold transition-colors cursor-pointer border border-blue-500/30"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Data Mitra</span>
                      </button>

                      <button
                        onClick={() => handleDeletePartner(partner.id)}
                        className="text-red-400 hover:text-red-300 font-bold hover:underline cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EDIT PROFIL TOKO PUSAT & KETERANGAN LAINNYA */}
          {activeTab === "store_settings" && (
            <div className="space-y-6 animate-in fade-in max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Edit Profil Toko Pusat & Keterangan Web</h2>
                <p className="text-xs text-slate-400">Ubah nama toko, tagline, pengumuman promo, hotline WhatsApp pusat, dan kata sandi admin.</p>
              </div>

              {/* Form Profil Toko */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
                <h3 className="font-bold text-sm text-white border-b border-slate-700 pb-2">
                  Informasi Brand & Identitas Toko
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Nama Toko Utama *</label>
                    <input
                      type="text"
                      value={storeProfile.storeName}
                      onChange={(e) => setStoreProfile({ ...storeProfile, storeName: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Slogan / Tagline *</label>
                    <input
                      type="text"
                      value={storeProfile.tagline}
                      onChange={(e) => setStoreProfile({ ...storeProfile, tagline: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-300">Teks Pengumuman Bilah Atas (Top Banner) *</label>
                    <input
                      type="text"
                      value={storeProfile.topBannerText}
                      onChange={(e) => setStoreProfile({ ...storeProfile, topBannerText: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Nomor WhatsApp Hotline Kantor Pusat *</label>
                    <input
                      type="text"
                      value={storeProfile.hotlineWhatsApp}
                      onChange={(e) => setStoreProfile({ ...storeProfile, hotlineWhatsApp: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Email Layanan Pelanggan *</label>
                    <input
                      type="email"
                      value={storeProfile.supportEmail}
                      onChange={(e) => setStoreProfile({ ...storeProfile, supportEmail: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-300">Alamat Gudang / Pabrik Pusat *</label>
                    <textarea
                      rows={2}
                      value={storeProfile.centralWarehouseAddress}
                      onChange={(e) => setStoreProfile({ ...storeProfile, centralWarehouseAddress: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={async () => {
                      saveStoreProfileToStorage(storeProfile);
                      const res = await saveStoreProfile(storeProfile);
                      if (res.error) {
                        alert("Profil tersimpan di browser, namun Supabase menolak: " + res.error.message + "\n\nPastikan Anda sudah menjalankan SQL Permission (RLS Fix) di Supabase.");
                      } else {
                        alert(`✅ Alhamdulillah! Profil toko "${storeProfile.storeName}" dan seluruh identitas brand berhasil tersimpan langsung ke database Supabase dan langsung aktif di seluruh website!`);
                      }
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil Toko ke Supabase</span>
                  </button>
                </div>
              </div>

              {/* Form Ubah Password Admin */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <KeyRound className="w-5 h-5" />
                  <span>Ganti Kata Sandi Administrator (Keamanan)</span>
                </div>

                <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-300">Kata Sandi Lama:</label>
                    <input
                      type="password"
                      required
                      value={newPasswordForm.old}
                      onChange={(e) => setNewPasswordForm({ ...newPasswordForm, old: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300">Kata Sandi Baru (Min. 6 Karakter):</label>
                    <input
                      type="password"
                      required
                      value={newPasswordForm.newPass}
                      onChange={(e) => setNewPasswordForm({ ...newPasswordForm, newPass: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300">Konfirmasi Sandi Baru:</label>
                    <input
                      type="password"
                      required
                      value={newPasswordForm.confirm}
                      onChange={(e) => setNewPasswordForm({ ...newPasswordForm, confirm: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-between items-center pt-2">
                    {passwordChangeSuccess && (
                      <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                        <Check className="w-4 h-4" /> Kata sandi admin berhasil diganti!
                      </span>
                    )}
                    <button
                      type="submit"
                      className="ml-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Ubah Kata Sandi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: PESANAN */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Monitoring Pesanan Nasional</h2>
                  <p className="text-xs text-slate-400">Pantau seluruh order yang masuk ke mitra-mitra daerah se-Indonesia.</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={async () => {
                      const liveOrds = await fetchLiveOrders();
                      if (liveOrds && liveOrds.length > 0) {
                        setOrdersList(liveOrds);
                        alert(`Alhamdulillah! Berhasil menarik ${liveOrds.length} pesanan langsung dari database Supabase!`);
                      } else {
                        alert("Belum ada data pesanan baru di Supabase.");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <span>🔄 Segarkan Pesanan Supabase</span>
                  </button>

                  <button
                    onClick={() => alert("Data pesanan berhasil diexport ke CSV.")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Filter */}
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
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>

              {/* Tabel Pesanan */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden divide-y divide-slate-700/60">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-750 transition-colors">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400 bg-slate-900 px-2 py-0.5 rounded">
                          {order.orderNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${order.status === "completed" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : order.status === "processing" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : order.status === "cancelled" ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"}`}>
                          {order.status.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-slate-400">• {order.date}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{order.customerName}</h4>
                      <p className="text-xs text-slate-300 font-medium">{order.itemsSummary}</p>
                      <p className="text-xs text-slate-400">
                        Mitra: <strong className="text-slate-200">{order.partnerName}</strong> • {order.fulfillment}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-base font-black text-white block">{formatRupiah(order.totalAmount)}</span>
                        <span className="text-xs text-slate-400">{order.paymentMethod}</span>
                      </div>

                      {/* Tombol Kontrol Status Pesanan Real-Time */}
                      <div className="flex items-center gap-1.5 pt-1">
                        {order.status !== "processing" && order.status !== "completed" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.orderNumber, "processing")}
                            className="px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer border border-blue-500/40"
                            title="Tandai pesanan sedang disiapkan mitra"
                          >
                            Proses
                          </button>
                        )}
                        {order.status !== "completed" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.orderNumber, "completed")}
                            className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer border border-emerald-500/40"
                            title="Tandai pesanan selesai diambil/dikirim"
                          >
                            Selesai
                          </button>
                        )}
                        {order.status !== "cancelled" && order.status !== "completed" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.orderNumber, "cancelled")}
                            className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer border border-red-500/40"
                            title="Batalkan pesanan"
                          >
                            Batal
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: KEPATUHAN & MSDS */}
          {activeTab === "safety" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl sm:text-2xl font-black text-white">Standar Keselamatan Kimia & APD</h2>
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3 text-xs text-slate-300">
                <p>• Seluruh produk berlabel <strong>Korosif</strong> atau <strong>Beracun</strong> secara otomatis mewajibkan persetujuan APD di halaman checkout.</p>
                <p>• MSDS tersimpan di Supabase Storage dan dapat diunduh langsung oleh pelanggan.</p>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ==========================================================
          MODAL FORM TAMBAH / EDIT PRODUK KIMIA
      ========================================================== */}
      {isAddProductModalOpen && (
        <ProductFormModal
          initialProduct={editingProduct}
          onClose={() => {
            setIsAddProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* ==========================================================
          MODAL FORM TAMBAH / EDIT MITRA DAERAH
      ========================================================== */}
      {isAddPartnerModalOpen && (
        <PartnerFormModal
          initialPartner={editingPartner}
          onClose={() => {
            setIsAddPartnerModalOpen(false);
            setEditingPartner(null);
          }}
          onSave={handleSavePartner}
        />
      )}

    </div>
  );
}

// ==========================================================
// SUB-KOMPONEN: MODAL FORM PRODUK (TAMBAH & EDIT)
// ==========================================================
function ProductFormModal({
  initialProduct,
  onClose,
  onSave,
}: {
  initialProduct: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const isEditing = !!initialProduct;

  const [form, setForm] = useState({
    name: initialProduct?.name || "",
    category: initialProduct?.category || "rumah-tangga",
    categoryLabel: initialProduct?.categoryLabel || "Kimia Rumah Tangga",
    isHouseholdChemical: initialProduct ? initialProduct.isHouseholdChemical : true,
    hazardLevel: initialProduct?.hazardLevel || "aman",
    description: initialProduct?.description || "",
    safetyGuidelines: initialProduct?.safetyGuidelines || "",
    image: initialProduct?.image || "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80",
    variants: initialProduct?.variants || [
      {
        id: "var-1",
        productId: "",
        unitName: "1 Liter (Botol)",
        sku: "SKU-1L",
        basePrice: 15000,
        retailPrice: 20000,
        weightGrams: 1050,
      },
      {
        id: "var-5",
        productId: "",
        unitName: "5 Liter (Jerigen)",
        sku: "SKU-5L",
        basePrice: 65000,
        retailPrice: 85000,
        weightGrams: 5200,
      },
    ],
  });

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...form.variants];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, variants: updated });
  };

  const handleAddVariant = () => {
    const newVar: ProductVariant = {
      id: "var-" + Date.now(),
      productId: initialProduct?.id || "",
      unitName: "20 Liter (Pail)",
      sku: "SKU-NEW-" + Math.floor(100 + Math.random() * 900),
      basePrice: 200000,
      retailPrice: 280000,
      weightGrams: 21000,
    };
    setForm({ ...form, variants: [...form.variants, newVar] });
  };

  const handleRemoveVariant = (index: number) => {
    if (form.variants.length <= 1) {
      alert("Produk minimal harus memiliki 1 varian kemasan.");
      return;
    }
    setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== index) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prodId = initialProduct?.id || "prod-" + Date.now();
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const categoryLabels: Record<string, string> = {
      "rumah-tangga": "Kimia Rumah Tangga",
      laundry: "Kimia Laundry",
      industri: "Bahan Kimia Teknis",
      "aroma-bibit": "Aroma & Bibit Parfum",
      kemasan: "Kemasan & Jerigen",
    };

    const finalProduct: Product = {
      id: prodId,
      name: form.name,
      slug: isEditing ? initialProduct!.slug : slug,
      category: form.category as ProductCategory,
      categoryLabel: categoryLabels[form.category] || "Kimia Produk",
      isHouseholdChemical: form.isHouseholdChemical,
      hazardLevel: form.hazardLevel as HazardLevel,
      description: form.description,
      features: initialProduct?.features || ["Formula terstandar kualitas tinggi", "Kemasan anti-bocor", "Siap pakai atau bahan murni"],
      safetyGuidelines: form.safetyGuidelines,
      image: form.image,
      variants: form.variants.map((v) => ({ ...v, productId: prodId })),
    };

    onSave(finalProduct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-black text-base text-white">
            {isEditing ? `Edit Produk: ${initialProduct?.name}` : "Tambah Produk Kimia Baru"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Nama Produk Kimia *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
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
                value={form.hazardLevel}
                onChange={(e) => setForm({ ...form, hazardLevel: e.target.value as any })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              >
                <option value="aman">Aman Rumah Tangga</option>
                <option value="iritasi">Iritasi Ringan</option>
                <option value="korosif">Korosif (Sarung Tangan)</option>
                <option value="mudah-terbakar">Mudah Terbakar</option>
                <option value="beracun">Bahan Beracun Teknis</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Tipe Produk</label>
              <select
                value={form.isHouseholdChemical ? "household" : "technical"}
                onChange={(e) => setForm({ ...form, isHouseholdChemical: e.target.value === "household" })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              >
                <option value="household">Siap Pakai (Rumah Tangga)</option>
                <option value="technical">Bahan Kimia Mentah (Teknis)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">URL Gambar Produk</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Deskripsi Lengkap Produk *</label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Petunjuk Keselamatan (Safety Guidelines)</label>
            <input
              type="text"
              placeholder="Gunakan sarung tangan karet saat pemakaian. Jauhkan dari anak-anak."
              value={form.safetyGuidelines}
              onChange={(e) => setForm({ ...form, safetyGuidelines: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
            />
          </div>

          {/* MANAJEMEN VARIAN KEMASAN */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-200">Varian Ukuran & Harga Kemasan</label>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-[11px] font-bold text-blue-400 hover:underline cursor-pointer"
              >
                + Tambah Ukuran Varian
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {form.variants.map((variant, index) => (
                <div key={variant.id || index} className="p-3 bg-slate-800 rounded-xl border border-slate-700 grid grid-cols-4 gap-2 items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nama Ukuran</span>
                    <input
                      type="text"
                      value={variant.unitName}
                      onChange={(e) => handleVariantChange(index, "unitName", e.target.value)}
                      className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Harga Retail (Rp)</span>
                    <input
                      type="number"
                      value={variant.retailPrice}
                      onChange={(e) => handleVariantChange(index, "retailPrice", Number(e.target.value))}
                      className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Berat (Gram)</span>
                    <input
                      type="number"
                      value={variant.weightGrams}
                      onChange={(e) => handleVariantChange(index, "weightGrams", Number(e.target.value))}
                      className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                  <div className="text-right pt-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="text-red-400 hover:text-red-300 font-bold cursor-pointer text-xs"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer shadow-md"
            >
              {isEditing ? "Simpan Perubahan Produk" : "Simpan Produk Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================================
// SUB-KOMPONEN: MODAL FORM MITRA DAERAH (TAMBAH & EDIT)
// ==========================================================
function PartnerFormModal({
  initialPartner,
  onClose,
  onSave,
}: {
  initialPartner: PartnerStore | null;
  onClose: () => void;
  onSave: (partner: PartnerStore) => void;
}) {
  const isEditing = !!initialPartner;

  const [form, setForm] = useState({
    name: initialPartner?.name || "",
    ownerName: initialPartner?.ownerName || "",
    phone: initialPartner?.phone || "",
    whatsapp: initialPartner?.whatsapp || "",
    city: initialPartner?.city || "",
    province: initialPartner?.province || "Jawa Barat",
    district: initialPartner?.district || "",
    address: initialPartner?.address || "",
    latitude: initialPartner?.latitude || -6.2088,
    longitude: initialPartner?.longitude || 106.8456,
    serviceRadiusKm: initialPartner?.serviceRadiusKm || 25,
    operationalHours: initialPartner?.operationalHours || "Senin - Sabtu: 08.00 - 17.00 WIB",
    supportsPickup: initialPartner ? initialPartner.supportsPickup : true,
    supportsLocalDelivery: initialPartner ? initialPartner.supportsLocalDelivery : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const partnerId = initialPartner?.id || "partner-" + Date.now();
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const finalPartner: PartnerStore = {
      id: partnerId,
      name: form.name,
      slug: isEditing ? initialPartner!.slug : slug,
      ownerName: form.ownerName,
      phone: form.phone,
      whatsapp: form.whatsapp || form.phone,
      city: form.city,
      province: form.province,
      district: form.district || form.city,
      address: form.address,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      serviceRadiusKm: Number(form.serviceRadiusKm),
      rating: initialPartner?.rating || 5.0,
      reviewCount: initialPartner?.reviewCount || 0,
      operationalHours: form.operationalHours,
      supportsPickup: form.supportsPickup,
      supportsLocalDelivery: form.supportsLocalDelivery,
      stockMap: initialPartner?.stockMap || {},
    };

    onSave(finalPartner);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-black text-base text-white">
            {isEditing ? `Edit Mitra: ${initialPartner?.name}` : "Daftarkan Mitra Daerah Baru"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Nama Toko Mitra *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Nama Penanggung Jawab *</label>
              <input
                type="text"
                required
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
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
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Kota / Kabupaten *</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Provinsi *</label>
              <input
                type="text"
                required
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Kecamatan *</label>
              <input
                type="text"
                required
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Alamat Lengkap Toko / Gudang Mitra *</label>
            <textarea
              rows={2}
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Radius Layanan (Km)</label>
              <input
                type="number"
                value={form.serviceRadiusKm}
                onChange={(e) => setForm({ ...form, serviceRadiusKm: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Latitude (GPS)</label>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Longitude (GPS)</label>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Jam Operasional Toko</label>
            <input
              type="text"
              value={form.operationalHours}
              onChange={(e) => setForm({ ...form, operationalHours: e.target.value })}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
            />
          </div>

          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.supportsPickup}
                onChange={(e) => setForm({ ...form, supportsPickup: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Bisa Ambil di Toko (Self-Pickup)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.supportsLocalDelivery}
                onChange={(e) => setForm({ ...form, supportsLocalDelivery: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Bisa Kurir Lokal Toko</span>
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer shadow-md"
            >
              {isEditing ? "Simpan Perubahan Mitra" : "Simpan Mitra Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
