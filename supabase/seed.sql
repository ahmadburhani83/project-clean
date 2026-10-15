-- ==========================================================
-- DATA AWAL (SEED DATA) TOKO KIMIA & MITRA DAERAH
-- ==========================================================

-- 1. KATEGORI
INSERT INTO public.categories (id, name, slug, description, display_order)
VALUES 
  ('11111111-1111-1111-1111-111111111101', 'Kimia Rumah Tangga', 'rumah-tangga', 'Pembersih piring, lantai, toilet, dan disinfektan', 1),
  ('11111111-1111-1111-1111-111111111102', 'Kimia Laundry', 'laundry', 'Deterjen, softener, pelicin setrika, dan penghilang noda', 2),
  ('11111111-1111-1111-1111-111111111103', 'Bahan Kimia Teknis', 'industri', 'Soda api, Texapon SLES, asam sitrat, dan bahan baku', 3),
  ('11111111-1111-1111-1111-111111111104', 'Aroma & Bibit Parfum', 'aroma-bibit', 'Bibit parfum murni grade A untuk laundry dan sabun', 4),
  ('11111111-1111-1111-1111-111111111105', 'Kemasan & Wadah', 'kemasan', 'Jerigen HDPE tebal, botol, dan pail drum', 5)
ON CONFLICT (slug) DO NOTHING;

-- 2. MITRA DAERAH
INSERT INTO public.partners (id, name, slug, owner_name, phone, whatsapp, address, province, city, district, latitude, longitude, service_radius_km, rating, review_count, operational_hours, supports_pickup, supports_local_delivery, is_active)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'Mitra Kimia Jakarta Barat', 'mitra-kimia-jakarta-barat', 'Budi Santoso', '081288991122', '081288991122', 'Jl. Daan Mogot KM 12 No. 45, Cengkareng', 'DKI Jakarta', 'Jakarta Barat', 'Cengkareng', -6.1558, 106.7345, 30.0, 4.9, 142, 'Senin - Sabtu: 08.00 - 17.30 WIB', TRUE, TRUE, TRUE),
  ('22222222-2222-2222-2222-222222222202', 'Depo Kimia Priangan Bandung', 'depo-kimia-priangan-bandung', 'Asep Sunandar', '081322334455', '081322334455', 'Jl. Terusan Buah Batu No. 108', 'Jawa Barat', 'Bandung', 'Buahbatu', -6.9532, 107.6321, 25.0, 4.8, 98, 'Senin - Sabtu: 08.30 - 17.00 WIB', TRUE, TRUE, TRUE),
  ('22222222-2222-2222-2222-222222222203', 'Mitra Kimia Rungkut Surabaya', 'mitra-kimia-rungkut-surabaya', 'Hendra Wijaya', '081134567890', '081134567890', 'Jl. Rungkut Industri Raya No. 18, SIER', 'Jawa Timur', 'Surabaya', 'Rungkut', -7.3245, 112.7601, 35.0, 4.9, 164, 'Senin - Sabtu: 08.00 - 17.00 WIB', TRUE, TRUE, TRUE),
  ('22222222-2222-2222-2222-222222222204', 'Pusat Kimia Semarang Gayamsari', 'pusat-kimia-semarang-gayamsari', 'Bambang Pamungkas', '081577889900', '081577889900', 'Jl. Majapahit No. 250, Gayamsari', 'Jawa Tengah', 'Semarang', 'Gayamsari', -6.9923, 110.4501, 25.0, 4.7, 76, 'Senin - Sabtu: 08.00 - 17.00 WIB', TRUE, TRUE, TRUE),
  ('22222222-2222-2222-2222-222222222205', 'Gudang Kimia Medan Helvetia', 'gudang-kimia-medan-helvetia', 'Tengku Firmansyah', '082166778899', '082166778899', 'Jl. Kapten Muslim No. 88, Helvetia', 'Sumatera Utara', 'Medan', 'Medan Helvetia', 3.5952, 98.6508, 30.0, 4.8, 82, 'Senin - Sabtu: 08.30 - 17.00 WIB', TRUE, TRUE, TRUE),
  ('22222222-2222-2222-2222-222222222206', 'Distributor Kimia Pettarani Makassar', 'distributor-kimia-pettarani-makassar', 'Andi Mallarangeng', '085244556677', '085244556677', 'Jl. A.P. Pettarani No. 120, Panakkukang', 'Sulawesi Selatan', 'Makassar', 'Panakkukang', -5.1528, 119.4398, 25.0, 4.9, 91, 'Senin - Sabtu: 08.00 - 17.00 WITA', TRUE, TRUE, TRUE),
  ('22222222-2222-2222-2222-222222222207', 'Depo Kimia Mataram Yogyakarta', 'depo-kimia-mataram-yogyakarta', 'Agus Wibowo', '081809090909', '081809090909', 'Jl. Ringroad Utara No. 56, Depok, Sleman', 'DI Yogyakarta', 'Sleman', 'Depok', -7.7612, 110.4089, 25.0, 4.8, 110, 'Senin - Sabtu: 08.30 - 17.00 WIB', TRUE, TRUE, TRUE)
ON CONFLICT (slug) DO NOTHING;
