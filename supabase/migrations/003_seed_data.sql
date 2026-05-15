-- Seed categories
insert into categories (id, name, icon, slug) values
  ('son-moi',         'Son Môi',          '💄', 'son-moi'),
  ('kem-duong',       'Kem Dưỡng',        '🧴', 'kem-duong'),
  ('serum',           'Serum',            '💧', 'serum'),
  ('phan-trang-diem', 'Phấn Trang Điểm',  '✨', 'phan-trang-diem'),
  ('nuoc-hoa',        'Nước Hoa',         '🌸', 'nuoc-hoa'),
  ('cham-soc-da',     'Chăm Sóc Da',      '🌿', 'cham-soc-da')
on conflict (id) do nothing;

-- Seed products
insert into products (id, category_id, name, brand, price, original_price, images, rating, review_count, sold_count, description, ingredients, is_new, is_best_seller, stock_quantity) values
-- Son Môi
('p1','son-moi','Son Kem Lì Black Rouge Air Fit Velvet Tint','Black Rouge',185000,220000,
 array['https://picsum.photos/seed/lip1/400/400','https://picsum.photos/seed/lip1b/400/400'],
 4.8,1243,5200,'Son kem lì với công thức Air Fit mang lại cảm giác nhẹ nhàng, thoải mái suốt cả ngày. Màu sắc tươi tắn, bền màu lên đến 8 tiếng.',
 'Dimethicone, Cyclopentasiloxane, Trimethylsiloxysilicate, Pigments',false,true,100),

('p2','son-moi','Son Thỏi Dưỡng Môi 3CE Velvet Lip Color','3CE',320000,380000,
 array['https://picsum.photos/seed/lip2/400/400','https://picsum.photos/seed/lip2b/400/400'],
 4.7,892,3100,'Son thỏi với kết cấu velvet mịn màng, dưỡng ẩm môi suốt ngày dài.',
 null,false,true,80),

('p3','son-moi','Son Bóng Dưỡng Môi Laneige Glowy Lip Gloss','Laneige',290000,null,
 array['https://picsum.photos/seed/lip3/400/400'],
 4.6,567,2400,'Son bóng dưỡng ẩm chuyên sâu với công thức Berry Mix Complex.',
 null,true,false,60),

('p4','son-moi','Son Tint Romand Juicy Lasting Tint','Romand',165000,195000,
 array['https://picsum.photos/seed/lip4/400/400','https://picsum.photos/seed/lip4b/400/400'],
 4.9,2156,8900,'Son tint dạng nước với màu sắc tươi sáng, bền màu cả ngày.',
 null,false,true,150),

('p5','son-moi','Son Môi MAC Matte Lipstick','MAC',580000,null,
 array['https://picsum.photos/seed/lip5/400/400'],
 4.7,445,1200,'Son thỏi lì kinh điển của MAC với màu sắc đậm, bền màu.',
 null,true,false,40),

-- Kem Dưỡng
('p6','kem-duong','Kem Dưỡng Ẩm Neutrogena Hydro Boost Water Gel','Neutrogena',345000,420000,
 array['https://picsum.photos/seed/cream1/400/400','https://picsum.photos/seed/cream1b/400/400'],
 4.8,3421,12000,'Kem dưỡng ẩm dạng gel với Hyaluronic Acid, cấp ẩm tức thì và duy trì 24 giờ.',
 'Water, Dimethicone, Glycerin, Hyaluronic Acid',false,true,200),

('p7','kem-duong','Kem Dưỡng Ban Đêm Olay Regenerist Micro-Sculpting Cream','Olay',420000,null,
 array['https://picsum.photos/seed/cream2/400/400'],
 4.6,1876,6700,'Kem dưỡng ban đêm với công thức Amino-Peptide giúp tái tạo da.',
 null,false,true,90),

('p8','kem-duong','Kem Dưỡng Ẩm Cetaphil Moisturizing Cream','Cetaphil',285000,320000,
 array['https://picsum.photos/seed/cream3/400/400'],
 4.9,5234,18000,'Kem dưỡng ẩm dịu nhẹ cho da nhạy cảm và da khô.',
 null,false,true,300),

('p9','kem-duong','Kem Dưỡng Trắng Da Pond''s White Beauty','Pond''s',125000,null,
 array['https://picsum.photos/seed/cream4/400/400'],
 4.4,2341,9800,'Kem dưỡng trắng da với công thức B3 Vitamin Complex.',
 null,false,false,120),

('p10','kem-duong','Kem Dưỡng Chống Lão Hóa La Roche-Posay Redermic R','La Roche-Posay',680000,750000,
 array['https://picsum.photos/seed/cream5/400/400'],
 4.7,987,3200,'Kem dưỡng chống lão hóa với Retinol tinh khiết.',
 null,true,false,50),

-- Serum
('p11','serum','Serum Vitamin C Klairs Freshly Juiced Vitamin Drop','Klairs',395000,450000,
 array['https://picsum.photos/seed/serum1/400/400','https://picsum.photos/seed/serum1b/400/400'],
 4.8,4521,15000,'Serum Vitamin C 5% dịu nhẹ, phù hợp da nhạy cảm.',
 'Ascorbic Acid 5%, Niacinamide, Hyaluronic Acid',false,true,180),

('p12','serum','Serum Niacinamide The Ordinary 10% + Zinc 1%','The Ordinary',245000,null,
 array['https://picsum.photos/seed/serum2/400/400'],
 4.7,8932,32000,'Serum Niacinamide 10% kết hợp Zinc 1%, kiểm soát dầu và thu nhỏ lỗ chân lông.',
 null,false,true,250),

('p13','serum','Serum Dưỡng Ẩm Hyaluronic Acid Inkey List','The Inkey List',195000,230000,
 array['https://picsum.photos/seed/serum3/400/400'],
 4.6,3210,11000,'Serum Hyaluronic Acid 2% với 3 loại HA khác nhau.',
 null,true,false,100),

('p14','serum','Serum Retinol Paula''s Choice 1% Retinol Treatment','Paula''s Choice',890000,null,
 array['https://picsum.photos/seed/serum4/400/400'],
 4.9,1543,4500,'Serum Retinol 1% cao cấp giúp tái tạo da, giảm nếp nhăn.',
 null,true,false,35),

('p15','serum','Serum Some By Mi AHA BHA PHA 30 Days Miracle','Some By Mi',285000,340000,
 array['https://picsum.photos/seed/serum5/400/400','https://picsum.photos/seed/serum5b/400/400'],
 4.7,6789,22000,'Serum kết hợp AHA, BHA và PHA giúp tẩy tế bào chết và làm sáng da.',
 null,false,true,160),

-- Phấn Trang Điểm
('p16','phan-trang-diem','Phấn Phủ Kiềm Dầu Innisfree No Sebum Mineral Powder','Innisfree',175000,210000,
 array['https://picsum.photos/seed/powder1/400/400'],
 4.8,7654,28000,'Phấn phủ kiềm dầu với khoáng chất tự nhiên từ đảo Jeju.',
 null,false,true,220),

('p17','phan-trang-diem','Phấn Nền Cushion Laneige Neo Cushion Matte','Laneige',650000,null,
 array['https://picsum.photos/seed/powder2/400/400','https://picsum.photos/seed/powder2b/400/400'],
 4.7,2341,7800,'Phấn nền cushion với lớp phủ mịn màng, kiểm soát dầu 12 giờ.',
 null,true,false,70),

('p18','phan-trang-diem','Phấn Má Hồng Etude House Lovely Cookie Blusher','Etude House',195000,240000,
 array['https://picsum.photos/seed/powder3/400/400'],
 4.6,1876,6500,'Phấn má hồng với màu sắc tươi sáng, tự nhiên.',
 null,false,true,90),

('p19','phan-trang-diem','Kem Nền Maybelline Fit Me Matte + Poreless Foundation','Maybelline',185000,null,
 array['https://picsum.photos/seed/powder4/400/400'],
 4.5,4532,16000,'Kem nền che phủ tốt, kiểm soát dầu và thu nhỏ lỗ chân lông.',
 null,false,false,130),

('p20','phan-trang-diem','Phấn Highlight Becca Shimmering Skin Perfector','BECCA',780000,890000,
 array['https://picsum.photos/seed/powder5/400/400'],
 4.9,987,2900,'Phấn highlight cao cấp với ánh sáng tự nhiên.',
 null,true,false,25),

-- Nước Hoa
('p21','nuoc-hoa','Nước Hoa Chanel Chance Eau Tendre EDT','Chanel',2850000,null,
 array['https://picsum.photos/seed/perfume1/400/400','https://picsum.photos/seed/perfume1b/400/400'],
 4.9,1234,3400,'Nước hoa nữ với hương thơm tươi mát, nhẹ nhàng.',
 null,false,true,30),

('p22','nuoc-hoa','Nước Hoa Dior Miss Dior Blooming Bouquet EDT','Dior',3200000,3600000,
 array['https://picsum.photos/seed/perfume2/400/400'],
 4.8,876,2100,'Nước hoa nữ với hương hoa tươi mát, quyến rũ.',
 null,false,true,20),

('p23','nuoc-hoa','Nước Hoa Mini Zara Gardenia EDT','Zara',185000,null,
 array['https://picsum.photos/seed/perfume3/400/400'],
 4.4,2341,8900,'Nước hoa mini với hương hoa gardenia dịu dàng.',
 null,true,false,80),

('p24','nuoc-hoa','Nước Hoa Versace Bright Crystal EDT','Versace',1850000,2100000,
 array['https://picsum.photos/seed/perfume4/400/400'],
 4.7,654,1800,'Nước hoa nữ với hương thơm trong sáng, tươi mát.',
 null,false,false,15),

('p25','nuoc-hoa','Nước Hoa Gucci Bloom EDP','Gucci',2450000,null,
 array['https://picsum.photos/seed/perfume5/400/400'],
 4.8,543,1500,'Nước hoa nữ với hương hoa trắng phong phú, quyến rũ.',
 null,true,false,12),

-- Chăm Sóc Da
('p26','cham-soc-da','Sữa Rửa Mặt CeraVe Hydrating Facial Cleanser','CeraVe',285000,320000,
 array['https://picsum.photos/seed/skincare1/400/400','https://picsum.photos/seed/skincare1b/400/400'],
 4.9,9876,35000,'Sữa rửa mặt dịu nhẹ với Ceramides và Hyaluronic Acid.',
 null,false,true,400),

('p27','cham-soc-da','Toner Cân Bằng Da Cosrx AHA/BHA Clarifying Treatment Toner','COSRX',245000,null,
 array['https://picsum.photos/seed/skincare2/400/400'],
 4.7,5432,19000,'Toner với AHA và BHA giúp tẩy tế bào chết nhẹ nhàng.',
 null,false,true,200),

('p28','cham-soc-da','Kem Chống Nắng Anessa Perfect UV Sunscreen SPF50+','Anessa',395000,450000,
 array['https://picsum.photos/seed/skincare3/400/400','https://picsum.photos/seed/skincare3b/400/400'],
 4.9,12345,45000,'Kem chống nắng SPF50+ PA++++ với công thức Aqua Booster.',
 null,false,true,350),

('p29','cham-soc-da','Mặt Nạ Dưỡng Ẩm Laneige Water Sleeping Mask','Laneige',345000,null,
 array['https://picsum.photos/seed/skincare4/400/400'],
 4.8,7654,26000,'Mặt nạ ngủ dưỡng ẩm chuyên sâu, giúp da căng mọng sau một đêm.',
 null,false,true,180),

('p30','cham-soc-da','Tẩy Trang Bioderma Sensibio H2O Micellar Water','Bioderma',285000,330000,
 array['https://picsum.photos/seed/skincare5/400/400','https://picsum.photos/seed/skincare5b/400/400'],
 4.8,8901,31000,'Nước tẩy trang micellar dịu nhẹ cho da nhạy cảm.',
 null,false,true,280)

on conflict (id) do nothing;
