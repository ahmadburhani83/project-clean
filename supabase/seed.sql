-- ==========================================================
-- DATA AWAL LENGKAP (SEED DATA)
-- TOKO KIMIA, PRODUK KIMIA RUMAH TANGGA, & MITRA DAERAH
-- ==========================================================

-- 1. MASTER KATEGORI
INSERT INTO public.categories (id, name, slug, description, display_order)
VALUES 
  ('11111111-1111-1111-1111-111111111101', 'Kimia Rumah Tangga', 'rumah-tangga', 'Pembersih piring, lantai, toilet, dan disinfektan', 1),
  ('11111111-1111-1111-1111-111111111102', 'Kimia Laundry', 'laundry', 'Deterjen, softener, pelicin setrika, dan penghilang noda', 2),
  ('11111111-1111-1111-1111-111111111103', 'Bahan Kimia Teknis', 'industri', 'Soda api, Texapon SLES, asam sitrat, dan bahan baku', 3),
  ('11111111-1111-1111-1111-111111111104', 'Aroma & Bibit Parfum', 'aroma-bibit', 'Bibit parfum murni grade A untuk laundry dan sabun', 4),
  ('11111111-1111-1111-1111-111111111105', 'Kemasan & Wadah', 'kemasan', 'Jerigen HDPE tebal, botol, dan pail drum', 5)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. JARINGAN MITRA DAERAH
INSERT INTO public.partners (id, name, slug, owner_name, phone, whatsapp, address, province, city, district, latitude, longitude, service_radius_km, rating, review_count, operational_hours, supports_pickup, supports_local_delivery, is_active)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'Mitra Kimia Jakarta Barat', 'mitra-kimia-jakarta-barat', 'Budi Santoso', '081288991122', '081288991122', 'Jl. Daan Mogot KM 12 No. 45, Cengkareng', 'DKI Jakarta', 'Jakarta Barat', 'Cengkareng', -6.1558, 106.7345, 30.0, 4.9, 142, 'Senin - Sabtu: 08.00 - 17.30 WIB', TRUE, TRUE, TRUE),
  ('22222222-2222-2222-2222-222222222202', 'Depo Kimia Priangan Bandung', 'depo-kimia-priangan-bandung', 'Asep Sunandar', '081322334455', '081322334455', 'Jl. Terusan Buah Batu No. 108', 'Jawa Barat', 'Bandung', 'Buahbatu', -6.9532, 107.6321, 25.0, 4.8, 98, 'Senin - Sabtu: 08.30 - 17.00 WIB', TRUE, TRUE, TRUE),
  ('22222222-2222-2222-2222-222222222203', 'Mitra Kimia Rungkut Surabaya', 'mitra-kimia-rungkut-surabaya', 'Hendra Wijaya', '081134567890', '081134567890', 'Jl. Rungkut Industri Raya No. 18, SIER', 'Jawa Timur', 'Surabaya', 'Rungkut', -7.3245, 112.7601, 35.0, 4.9, 164, 'Senin - Sabtu: 08.00 - 17.00 WIB', TRUE, TRUE, TRUE),
  ('22222222-2222-2222-2222-222222222204', 'Pusat Kimia Semarang Gayamsari', 'pusat-kimia-semarang-gayamsari', 'Bambang Pamungkas', '081577889900', '081577889900', 'Jl. Majapahit No. 250, Gayamsari', 'Jawa Tengah', 'Semarang', 'Gayamsari', -6.9923, 110.4501, 25.0, 4.7, 76, 'Senin - Sabtu: 08.00 - 17.00 WIB', TRUE, TRUE, TRUE),
  ('22222222-2222-2222-2222-222222222205', 'Gudang Kimia Medan Helvetia', 'gudang-kimia-medan-helvetia', 'Tengku Firmansyah', '082166778899', '082166778899', 'Jl. Kapten Muslim No. 88, Helvetia', 'Sumatera Utara', 'Medan', 'Medan Helvetia', 3.5952, 98.6508, 30.0, 4.8, 82, 'Senin - Sabtu: 08.30 - 17.00 WIB', TRUE, TRUE, TRUE),
  ('22222222-2222-2222-2222-222222222206', 'Distributor Kimia Pettarani Makassar', 'distributor-kimia-pettarani-makassar', 'Andi Mallarangeng', '085244556677', '085244556677', 'Jl. A.P. Pettarani No. 120, Panakkukang', 'Sulawesi Selatan', 'Makassar', 'Panakkukang', -5.1528, 119.4398, 25.0, 4.9, 91, 'Senin - Sabtu: 08.00 - 17.00 WITA', TRUE, TRUE, TRUE),
  ('22222222-2222-2222-2222-222222222207', 'Depo Kimia Mataram Yogyakarta', 'depo-kimia-mataram-yogyakarta', 'Agus Wibowo', '081809090909', '081809090909', 'Jl. Ringroad Utara No. 56, Depok, Sleman', 'DI Yogyakarta', 'Sleman', 'Depok', -7.7612, 110.4089, 25.0, 4.8, 110, 'Senin - Sabtu: 08.30 - 17.00 WIB', TRUE, TRUE, TRUE)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, address = EXCLUDED.address, whatsapp = EXCLUDED.whatsapp;

-- 3. PRODUK MASTER (KIMIA & RUMAH TANGGA)
INSERT INTO public.products (id, category_id, name, slug, description, features, safety_guidelines, hazard_level, is_household_chemical, image_url, is_active)
VALUES
  (
    '33333333-3333-3333-3333-333333333301',
    '11111111-1111-1111-1111-111111111102',
    'Deterjen Cair Laundry Konsentrat Oxi-Power',
    'deterjen-cair-laundry-konsentrat-oxi-power',
    'Formula deterjen cair konsentrat dengan teknologi enzim aktif dan oksigen aktif. Ampuh mengangkat noda lemak, minyak, dan noda membandel pada pakaian tanpa merusak serat kain. Busa seimbang, mudah dibilas, hemat air, dan cocok untuk mesin cuci bukaan depan (front load) maupun bukaan atas (top load).',
    '["Konsentrat tinggi, hemat pemakaian (cukup 30ml untuk 5kg cucian)", "Busa rendah & mudah dibilas (Aman untuk mesin cuci)", "Mengandung Optical Brightener, pakaian tampak lebih cerah", "Anti-bakteri & mencegah bau apek meski jemur di dalam ruangan", "Biodegradable dan ramah lingkungan"]'::jsonb,
    'Jauhkan dari jangkauan anak-anak. Jika terkena mata, bilas segera dengan air mengalir selama 15 menit. Tidak untuk diminum.',
    'aman',
    TRUE,
    'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    '33333333-3333-3333-3333-333333333302',
    '11111111-1111-1111-1111-111111111101',
    'Sabun Cuci Piring Jeruk Nipis Ultra Clean',
    'sabun-cuci-piring-jeruk-nipis-ultra-clean',
    'Cairan pencuci piring berkekuatan ekstrak jeruk nipis asli dipadukan dengan formula pembersih lemak kelas industri. Efektif melarutkan lemak dan bau amis amis membandel pada peralatan makan dan masak, berbusa melimpah namun tetap lembut di tangan berkat pelembab alami.',
    '["1 tetes bersihkan tumpukan piring berlemak", "Ekstrak jeruk nipis alami hilangkan bau amis seketika", "Mengandung Gliserin nabati, tidak membuat telapak tangan kering / kasar", "Food-grade formula, aman dibilas bersih untuk wadah makanan bayi"]'::jsonb,
    'Simpan pada suhu ruangan terhindar dari sinar matahari langsung. Aman untuk kulit tangan normal.',
    'aman',
    TRUE,
    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    '33333333-3333-3333-3333-333333333303',
    '11111111-1111-1111-1111-111111111101',
    'Karbol Pinus Wangi Disinfektan Antikuman',
    'karbol-pinus-wangi-disinfektan-antikuman',
    'Pembersih dan disinfektan lantai dengan kandungan getah minyak pinus murni. Efektif membunuh 99.9% kuman dan bakteri penyebab bau tidak sedap di kamar mandi, kandang hewan peliharaan, selokan, dan lantai rumah sakit/klinik.',
    '["Kandungan pine oil murni, aroma pinus segar pegunungan tahan lama", "Membunuh kuman, bakteri Salmonella & E. coli", "Menghilangkan bau pesing, amis, dan selokan dalam hitungan detik", "Dapat digunakan untuk mengepel lantai maupun membersihkan kloset"]'::jsonb,
    'Dapat menyebabkan iritasi mata. Gunakan sarung tangan karet jika memiliki kulit sensitif. Jangan dicampur dengan pemutih klorin.',
    'iritasi',
    TRUE,
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    '33333333-3333-3333-3333-333333333304',
    '11111111-1111-1111-1111-111111111102',
    'Pelicin & Pengharum Pakaian Floral Fresh',
    'pelicin-pengharum-pakaian-floral-fresh',
    'Cairan pelicin setrika sekaligus pelembut dan pengharum pakaian siap semprot. Memudahkan proses menyetrika pakaian kusut menjadi licin sempurna, tidak meninggalkan bercak putih pada kain hitam/gelap, dan wangi mewah tahan hingga 14 hari di lemari.',
    '["Menyetrika lebih cepat, serat pakaian langsung rapi seketika", "Wangi Floral Fresh elegan ala parfum laundry profesional", "Anti-statis & bebas residu bercak pada pakaian", "Praktis, langsung disemprotkan pada pakaian sebelum disetrika"]'::jsonb,
    'Aman untuk segala jenis pakaian katun, drill, sifon, dan sintetis. Jauhkan dari semprotan langsung ke arah mata.',
    'aman',
    TRUE,
    'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    '33333333-3333-3333-3333-333333333305',
    '11111111-1111-1111-1111-111111111101',
    'Pembersih Kerak Porselen & Keramik Heavy Duty',
    'pembersih-kerak-porselen-keramik-heavy-duty',
    'Cairan asam pembersih kerak air membandel, kerak semen, karat, dan endapan lumut pada lantai keramik, kloset kamar mandi, dan porselen. Bekerja sangat cepat hanya dengan dioles menggunakan kuas tanpa perlu disikat keras.',
    '["Hanya dioles kuas, kerak kuning/hitam menahun langsung rontok", "Tidak merusak lapisan glasir keramik jika digunakan sesuai takaran", "Daya bersih 5x lebih kuat daripada pembersih lantai supermarket biasa"]'::jsonb,
    'PERHATIAN KOROSIF: Wajib gunakan sarung tangan karet dan masker saat pemakaian. Jangan mengenai permukaan marmer, granit, atau logam kuningan/krom.',
    'korosif',
    TRUE,
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    '33333333-3333-3333-3333-333333333306',
    '11111111-1111-1111-1111-111111111103',
    'Soda Api Flake 98% (Caustic Soda / NaOH)',
    'soda-api-flake-98-caustic-soda-naoh',
    'Sodium Hidroksida (NaOH) murni 98% bentuk serpihan kristal putih (flake). Sangat efektif untuk melancarkan saluran pipa wastafel/WC yang mampet akibat lemak dan rambut, bahan baku pembuatan sabun batangan, pengatur pH industri tekstil, dan pembersih kotoran berat.',
    '["Kemurnian tinggi 98% standar industri internasional", "Reaksi eksotermik cepat menghasilkan panas pengurai lemak pipa", "Bahan baku utama saponifikasi sabun padat (CP/HP soap)", "Kemasan kedap udara anti-menggumpal"]'::jsonb,
    'BAHAYA KOROSIF TINGGI! Mengeluarkan panas hebat saat dilarutkan ke dalam air. Selalu tuang soda api ke dalam air dingin, BUKAN sebaliknya. Wajib gunakan kacamata pelindung dan sarung tangan karet tahan kimia.',
    'korosif',
    FALSE,
    'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    '33333333-3333-3333-3333-333333333307',
    '11111111-1111-1111-1111-111111111103',
    'Texapon 70% (SLES / Sodium Lauryl Ether Sulfate)',
    'texapon-70-sles-surfactant',
    'Surfaktan anionik pasta kental bening dengan konsentrasi 70%. Bahan dasar utama penghasil busa melimpah dan pembersih kotoran pada formula sabun cuci piring, deterjen cair, shampo motor/mobil, dan sabun mandi cair.',
    '["Konsentrasi aktif 70% kemurnian prima (Asli BASF / setara)", "Busa sangat tebal, stabil, dan berdaya bersih tinggi", "Mudah dilarutkan dalam air hangat dengan penambahan garam dapur (NaCl) sebagai pengental"]'::jsonb,
    'Konsentrat pekat dapat mengiritasi mata. Kenakan kacamata kerja dan sarung tangan saat menimbang & mengaduk.',
    'iritasi',
    FALSE,
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    '33333333-3333-3333-3333-333333333308',
    '11111111-1111-1111-1111-111111111103',
    'Citric Acid Anhydrous (Asam Sitrat / Citrun Murni)',
    'citric-acid-anhydrous-asam-sitrat-citrun',
    'Asam sitrat kristal bubuk putih kemurnian tinggi. Sangat populer digunakan sebagai pembersih kerak air ketel/dispenser, pencerah pakaian putih dari noda karat, bahan pengatur keasaman, dan chelating agent dalam formulasi pembersih.',
    '["Grade Anhydrous murni, tidak basah dan mudah larut", "Ampuh merontokkan kerak air kalsium & karat logam", "Membantu mengikat mineral air sadah agar sabun lebih berbusa", "Serbaguna untuk kebutuhan industri maupun perumahan"]'::jsonb,
    'Dapat menyebabkan pedih pada mata terbuka. Simpan di tempat kering dan sejuk.',
    'iritasi',
    FALSE,
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    '33333333-3333-3333-3333-333333333309',
    '11111111-1111-1111-1111-111111111104',
    'Bibit Parfum Murni Grade A (Varian Sakura & Downy Red)',
    'bibit-parfum-murni-grade-a-laundry',
    'Minyak wangi murni (fragrance oil) 100% tanpa campuran alkohol atau solven. Aroma segar mewah dan tahan berhari-hari. Sangat cocok untuk parfum laundry, pelembut pakaian, sabun cuci piring, sabun mandi, dan reed diffuser.',
    '["100% Konsentrat murni tanpa campuran solven/DPG", "Aroma tahan lama dengan top, middle, dan base note seimbang", "Dapat dilarutkan ke dalam formula air menggunakan solubilizer atau metanol"]'::jsonb,
    'Hanya untuk pemakaian luar / aroma formula, tidak untuk dikonsumsi.',
    'aman',
    FALSE,
    'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    TRUE
  )
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;

-- 4. VARIAN PRODUK (UKURAN & HARGA)
INSERT INTO public.product_variants (id, product_id, sku, unit_name, base_price, retail_price, weight_grams, is_active)
VALUES
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'DET-OXI-1L', '1 Liter (Botol)', 16000, 22000, 1050, TRUE),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', 'DET-OXI-5L', '5 Liter (Jerigen)', 70000, 95000, 5200, TRUE),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', 'DET-OXI-20L', '20 Liter (Pail)', 260000, 345000, 21000, TRUE),

  ('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333302', 'SCP-LIME-1L', '1 Liter (Botol)', 12000, 16500, 1050, TRUE),
  ('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333302', 'SCP-LIME-5L', '5 Liter (Jerigen)', 50000, 68000, 5200, TRUE),
  ('44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333302', 'SCP-LIME-20L', '20 Liter (Pail)', 185000, 245000, 21000, TRUE),

  ('44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333303', 'KRB-PINUS-1L', '1 Liter (Botol)', 14000, 19500, 1050, TRUE),
  ('44444444-4444-4444-4444-444444444408', '33333333-3333-3333-3333-333333333303', 'KRB-PINUS-5L', '5 Liter (Jerigen)', 58000, 79000, 5200, TRUE),

  ('44444444-4444-4444-4444-444444444409', '33333333-3333-3333-3333-333333333304', 'PLC-FLORAL-1L', '1 Liter (Botol)', 13000, 18000, 1050, TRUE),
  ('44444444-4444-4444-4444-444444444410', '33333333-3333-3333-3333-333333333304', 'PLC-FLORAL-5L', '5 Liter (Jerigen)', 52000, 72000, 5200, TRUE),

  ('44444444-4444-4444-4444-444444444411', '33333333-3333-3333-3333-333333333305', 'PBK-HD-1L', '1 Liter (Botol HDPE)', 20000, 28000, 1150, TRUE),
  ('44444444-4444-4444-4444-444444444412', '33333333-3333-3333-3333-333333333305', 'PBK-HD-5L', '5 Liter (Jerigen)', 85000, 118000, 5400, TRUE),

  ('44444444-4444-4444-4444-444444444413', '33333333-3333-3333-3333-333333333306', 'NAOH-FLK-1KG', '1 Kg (Pouch Tebal)', 18000, 25000, 1020, TRUE),
  ('44444444-4444-4444-4444-444444444414', '33333333-3333-3333-3333-333333333306', 'NAOH-FLK-5KG', '5 Kg (Kemasan Ember)', 82000, 115000, 5200, TRUE),
  ('44444444-4444-4444-4444-444444444415', '33333333-3333-3333-3333-333333333306', 'NAOH-FLK-25KG', '25 Kg (Sak Asli Pabrik)', 375000, 475000, 25200, TRUE),

  ('44444444-4444-4444-4444-444444444416', '33333333-3333-3333-3333-333333333307', 'SLES-70-1KG', '1 Kg (Pail Kecil)', 28000, 38000, 1050, TRUE),
  ('44444444-4444-4444-4444-444444444417', '33333333-3333-3333-3333-333333333307', 'SLES-70-5KG', '5 Kg (Pail)', 130000, 175000, 5300, TRUE),
  ('44444444-4444-4444-4444-444444444418', '33333333-3333-3333-3333-333333333307', 'SLES-70-20KG', '20 Kg (Pail Besar)', 480000, 620000, 21200, TRUE),

  ('44444444-4444-4444-4444-444444444419', '33333333-3333-3333-3333-333333333308', 'CITRIC-ANH-1KG', '1 Kg (Pouch)', 22000, 29000, 1020, TRUE),
  ('44444444-4444-4444-4444-444444444420', '33333333-3333-3333-3333-333333333308', 'CITRIC-ANH-5KG', '5 Kg (Kemasan Ember)', 95000, 130000, 5200, TRUE),
  ('44444444-4444-4444-4444-444444444421', '33333333-3333-3333-3333-333333333308', 'CITRIC-ANH-25KG', '25 Kg (Sak Pabrik)', 420000, 535000, 25200, TRUE),

  ('44444444-4444-4444-4444-444444444422', '33333333-3333-3333-3333-333333333309', 'FRG-SAKURA-500G', '500 Gram (Botol Alum)', 95000, 135000, 520, TRUE),
  ('44444444-4444-4444-4444-444444444423', '33333333-3333-3333-3333-333333333309', 'FRG-SAKURA-1KG', '1 Kg (Alum Canister)', 175000, 240000, 1050, TRUE)
ON CONFLICT (sku) DO UPDATE
SET unit_name = EXCLUDED.unit_name, base_price = EXCLUDED.base_price, retail_price = EXCLUDED.retail_price;

-- 5. STOK AWAL DI MITRA JAKARTA BARAT & BANDUNG
INSERT INTO public.partner_inventory (partner_id, variant_id, stock_quantity)
VALUES
  ('22222222-2222-2222-2222-222222222201', '44444444-4444-4444-4444-444444444401', 80),
  ('22222222-2222-2222-2222-222222222201', '44444444-4444-4444-4444-444444444402', 50),
  ('22222222-2222-2222-2222-222222222201', '44444444-4444-4444-4444-444444444404', 120),
  ('22222222-2222-2222-2222-222222222201', '44444444-4444-4444-4444-444444444405', 75),
  ('22222222-2222-2222-2222-222222222201', '44444444-4444-4444-4444-444444444407', 60),
  ('22222222-2222-2222-2222-222222222201', '44444444-4444-4444-4444-444444444413', 100),
  ('22222222-2222-2222-2222-222222222201', '44444444-4444-4444-4444-444444444416', 60),
  ('22222222-2222-2222-2222-222222222201', '44444444-4444-4444-4444-444444444419', 80)
ON CONFLICT (partner_id, variant_id) DO UPDATE
SET stock_quantity = EXCLUDED.stock_quantity;

-- 6. SETTING DEFAULT PROFIL TOKO PUSAT
INSERT INTO public.store_settings (id, store_name, tagline, top_banner_text, central_warehouse_address, hotline_whatsapp, support_email, cargo_notes)
VALUES (
  'default',
  'KIMIA NUSANTARA',
  'Toko Kimia & Produk Rumah Tangga',
  'Pesan bahan kimia & produk rumah tangga lewat Mitra Terdekat di Kota Anda untuk hemat ongkir!',
  'Kawasan Industri Cikupa Mas Blok B-12, Tangerang, Banten',
  '081234567890',
  'support@kimianusantara.id',
  'Pengiriman luar kota menggunakan armada kargo khusus cairan bersegel.'
)
ON CONFLICT (id) DO NOTHING;
