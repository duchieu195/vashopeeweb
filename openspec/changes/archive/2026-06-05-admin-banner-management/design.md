## Context

Admin dùng **Refine v4 + Ant Design** với Supabase làm data provider. Pattern hiện tại (products, categories, coupons) dùng `useForm`, `useList`, `Create`/`Edit`/`List` từ `@refinedev/antd`, upload ảnh lên Supabase Storage bucket `product-images`.

Storefront dùng React + Vite + TailwindCSS, banner hiện hardcode trong `BannerCarousel.tsx` với array tĩnh gồm `id`, `image`, `title`, `subtitle`, `bg`.

## Goals / Non-Goals

**Goals:**
- Admin CRUD banner: list với drag-to-reorder sort_order, create/edit với upload ảnh, toggle is_active
- Hiển thị rõ kích thước khuyến nghị **1200×400px** (tỉ lệ 3:1) trong form
- BannerCarousel đọc từ Supabase, chỉ lấy banner `is_active = true` theo `sort_order`

**Non-Goals:**
- Gradient background per-banner (bỏ trường `bg` — ảnh phủ 100% không cần gradient)
- Preview trực tiếp trong admin
- Scheduled/timed banners
- Multiple banner zones

## Decisions

**Bỏ trường `bg` gradient**
Ảnh banner phủ toàn bộ (`opacity: 100%` thay vì `30%`), text đặt trên overlay tối. Đơn giản hơn, hình ảnh đẹp hơn.

**Storage bucket `banner-images`** (tách khỏi `product-images`)
Tách bucket giúp quản lý permission riêng, không lẫn với ảnh sản phẩm.

**Fallback về banner tĩnh nếu Supabase trả về rỗng**
Giữ 3 banner hardcode làm fallback, tránh trang chủ trống khi chưa có data.

**`sort_order` là integer tăng dần**
Admin chỉnh thứ tự bằng input number trong form Edit. Drag-to-reorder là overkill cho tính năng này.

## Risks / Trade-offs

- Storefront gọi thêm 1 query Supabase khi load trang chủ → không đáng kể (1 fetch nhỏ, cached)
- Nếu storage bucket chưa được tạo → banner upload sẽ fail. Migration phải tạo bucket hoặc hướng dẫn rõ trong tasks.
