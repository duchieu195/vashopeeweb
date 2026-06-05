## 1. Database & Storage

- [x] 1.1 Tạo migration `supabase/migrations/011_banners.sql`: bảng `banners` (id, title, subtitle, image_url, sort_order, is_active, created_at), RLS public read + admin all
- [x] 1.2 Tạo Supabase Storage bucket `banner-images` với public access (thêm vào migration hoặc hướng dẫn tạo thủ công qua Supabase Dashboard)

## 2. Admin — BannerList

- [x] 2.1 Tạo `vashopeeweb-admin/src/pages/banners/BannerList.tsx`: Refine `List` + Ant Design `Table` với cột thumbnail (40px), title, subtitle, sort_order, is_active (Tag), actions (Edit/Delete)

## 3. Admin — BannerCreate & BannerEdit

- [x] 3.1 Tạo `vashopeeweb-admin/src/pages/banners/BannerCreate.tsx`: form với fields title, subtitle, sort_order (InputNumber, default 0), is_active (Switch, default true), upload ảnh lên bucket `banner-images` với gợi ý "Kích thước khuyến nghị: 1200×400px (tỉ lệ 3:1)"
- [x] 3.2 Tạo `vashopeeweb-admin/src/pages/banners/BannerEdit.tsx`: giống Create, load dữ liệu hiện tại vào form, hiển thị ảnh cũ khi chưa thay

## 4. Admin — Đăng ký resource

- [x] 4.1 Thêm resource `banners` vào `vashopeeweb-admin/src/App.tsx` với list/create/edit routes và icon `PictureOutlined`
- [x] 4.2 Import và đăng ký 3 trang BannerList, BannerCreate, BannerEdit vào Routes trong App.tsx

## 5. Storefront — BannerCarousel

- [x] 5.1 Cập nhật `vashopeeweb-app/src/components/BannerCarousel.tsx`: fetch từ Supabase `banners` (is_active=true, order by sort_order), fallback về array tĩnh nếu rỗng
- [x] 5.2 Cập nhật render: ảnh `opacity-100` + overlay `bg-black/40`, bỏ trường `bg` gradient
