-- ==========================================================
-- SKEMA BASIS DATA SUPABASE (POSTGRESQL)
-- PLATFORM E-COMMERCE TOKO KIMIA & MULTI-MITRA DAERAH
-- ==========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'mitra', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE hazard_level_enum AS ENUM ('aman', 'iritasi', 'korosif', 'mudah-terbakar', 'beracun');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipping', 'ready_pickup', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE fulfillment_type AS ENUM ('partner_delivery', 'partner_pickup', 'central_cargo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'customer' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0
);

-- 5. PARTNERS (MITRA TOKO DAERAH)
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    address TEXT NOT NULL,
    province TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    postal_code TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    service_radius_km DOUBLE PRECISION DEFAULT 25.0 NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    operational_hours TEXT DEFAULT 'Senin - Sabtu: 08:00 - 17:00',
    supports_pickup BOOLEAN DEFAULT TRUE,
    supports_local_delivery BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCTS (PRODUK KIMIA & KIMIA RUMAH TANGGA)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    safety_guidelines TEXT,
    hazard_level hazard_level_enum DEFAULT 'aman',
    msds_url TEXT,
    is_household_chemical BOOLEAN DEFAULT TRUE,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRODUCT VARIANTS (Kemasan & Ukuran)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    unit_name TEXT NOT NULL, -- Contoh: "1 Liter", "5 Liter (Jerigen)", "25 Kg (Sak)"
    base_price DECIMAL(12, 2) NOT NULL,
    retail_price DECIMAL(12, 2) NOT NULL,
    weight_grams INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 8. PARTNER INVENTORY (Stok per Gudang Mitra Daerah)
CREATE TABLE IF NOT EXISTS public.partner_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    stock_quantity INTEGER DEFAULT 0 NOT NULL,
    custom_price DECIMAL(12, 2), -- Null jika mengikuti harga acuan pusat
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(partner_id, variant_id)
);

-- 9. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
    fulfillment_type fulfillment_type NOT NULL,
    status order_status DEFAULT 'pending' NOT NULL,
    total_products_amount DECIMAL(12, 2) NOT NULL,
    shipping_fee DECIMAL(12, 2) DEFAULT 0 NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_district TEXT NOT NULL,
    shipping_province TEXT,
    notes TEXT,
    payment_method TEXT DEFAULT 'qris',
    payment_reference TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    unit_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL
);

-- ==========================================================
-- INDEXES
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_partners_city ON public.partners(city);
CREATE INDEX IF NOT EXISTS idx_partners_province ON public.partners(province);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_partner ON public.orders(partner_id);

-- ==========================================================
-- FUNGSI JARAK HAVERSINE (Pencarian Mitra Terdekat)
-- ==========================================================
CREATE OR REPLACE FUNCTION get_nearby_partners(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    max_radius_km DOUBLE PRECISION DEFAULT 50.0
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    owner_name TEXT,
    phone TEXT,
    whatsapp TEXT,
    address TEXT,
    city TEXT,
    province TEXT,
    district TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    service_radius_km DOUBLE PRECISION,
    rating NUMERIC(3, 2),
    review_count INTEGER,
    operational_hours TEXT,
    distance_km DOUBLE PRECISION
) LANGUAGE sql STABLE AS $$
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.owner_name,
        p.phone,
        p.whatsapp,
        p.address,
        p.city,
        p.province,
        p.district,
        p.latitude,
        p.longitude,
        p.service_radius_km,
        p.rating,
        p.review_count,
        p.operational_hours,
        ROUND(
            (6371 * acos(
                LEAST(1.0, GREATEST(-1.0,
                    cos(radians(user_lat)) * cos(radians(p.latitude)) *
                    cos(radians(p.longitude) - radians(user_lng)) +
                    sin(radians(user_lat)) * sin(radians(p.latitude))
                ))
            ))::numeric, 1
        )::DOUBLE PRECISION AS distance_km
    FROM public.partners p
    WHERE p.is_active = TRUE
      AND (
          6371 * acos(
              LEAST(1.0, GREATEST(-1.0,
                  cos(radians(user_lat)) * cos(radians(p.latitude)) *
                  cos(radians(p.longitude) - radians(user_lng)) +
                  sin(radians(user_lat)) * sin(radians(p.latitude))
              ))
          )
      ) <= max_radius_km
    ORDER BY distance_km ASC;
$$;

-- 11. STORE SETTINGS (PROFIL & IDENTITAS TOKO)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    store_name TEXT NOT NULL DEFAULT 'KIMIA NUSANTARA',
    tagline TEXT NOT NULL DEFAULT 'Toko Kimia & Produk Rumah Tangga',
    top_banner_text TEXT NOT NULL DEFAULT 'Pesan bahan kimia & produk rumah tangga lewat Mitra Terdekat di Kota Anda untuk hemat ongkir!',
    central_warehouse_address TEXT NOT NULL DEFAULT 'Kawasan Industri Cikupa Mas Blok B-12, Tangerang, Banten',
    hotline_whatsapp TEXT NOT NULL DEFAULT '081234567890',
    support_email TEXT NOT NULL DEFAULT 'support@kimianusantara.id',
    cargo_notes TEXT NOT NULL DEFAULT 'Pengiriman luar kota menggunakan armada kargo khusus cairan bersegel.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Public read partners" ON public.partners;
DROP POLICY IF EXISTS "Public read variants" ON public.product_variants;
DROP POLICY IF EXISTS "Public read inventory" ON public.partner_inventory;
DROP POLICY IF EXISTS "Customers read own orders" ON public.orders;
DROP POLICY IF EXISTS "Partners read store orders" ON public.orders;
DROP POLICY IF EXISTS "Customers create orders" ON public.orders;
DROP POLICY IF EXISTS "Order items insertable" ON public.order_items;
DROP POLICY IF EXISTS "Allow all on store_settings" ON public.store_settings;

CREATE POLICY "Allow all on products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on partners" ON public.partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on product_variants" ON public.product_variants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on partner_inventory" ON public.partner_inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on store_settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);
