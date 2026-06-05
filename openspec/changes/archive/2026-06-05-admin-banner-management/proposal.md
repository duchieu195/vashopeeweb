## Why

Banner trên trang chủ hiện được hardcode trong `BannerCarousel.tsx` — admin không thể thay đổi nội dung, ảnh, hay text mà không cần sửa code và deploy lại. Thêm mục quản lý banner vào admin giúp thay đổi nội dung marketing theo mùa hay sự kiện mà không cần dev.

## What Changes

- Tạo bảng `banners` trong Supabase với các trường: `id`, `title`, `subtitle`, `image_url`, `sort_order`, `is_active`
- Tạo Supabase Storage bucket `banner-images` để upload ảnh banner
- Thêm RLS: public read, admin full access
- Thêm migration SQL cho bảng và policies
- Tạo 3 trang admin: `BannerList`, `BannerCreate`, `BannerEdit` (Refine + Ant Design, giống pattern hiện tại)
- Đăng ký resource `banners` vào `App.tsx` của admin
- Cập nhật `BannerCarousel.tsx` trong storefront để đọc dữ liệu từ Supabase thay vì hardcode
- Hiển thị thông số kích thước khuyến nghị (1200×400px) trong form upload ảnh

## Capabilities

### New Capabilities
- `banner-admin-crud`: CRUD banner trong admin panel — list, create, edit, delete với upload ảnh lên Supabase Storage
- `banner-dynamic-display`: BannerCarousel đọc dữ liệu từ Supabase, fallback về banner tĩnh nếu không có data

### Modified Capabilities

## Impact

- `vashopeeweb-admin/src/App.tsx` — thêm resource và routes cho banners
- `vashopeeweb-admin/src/pages/banners/` — 3 file mới
- `vashopeeweb-app/src/components/BannerCarousel.tsx` — refactor đọc từ DB
- `supabase/migrations/011_banners.sql` — bảng mới + RLS + storage bucket
