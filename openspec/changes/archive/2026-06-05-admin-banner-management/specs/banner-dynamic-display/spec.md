## ADDED Requirements

### Requirement: BannerCarousel đọc dữ liệu từ Supabase
Hệ thống SHALL fetch danh sách banner từ bảng `banners` trong Supabase, chỉ lấy các banner có `is_active = true`, sắp xếp theo `sort_order` tăng dần.

#### Scenario: Hiển thị banner từ database
- **WHEN** trang chủ load
- **THEN** BannerCarousel hiển thị các banner active từ Supabase theo thứ tự sort_order

#### Scenario: Fallback khi không có banner trong database
- **WHEN** bảng `banners` trống hoặc không có banner active
- **THEN** BannerCarousel hiển thị 3 banner tĩnh mặc định (giữ nguyên nội dung cũ)

### Requirement: Banner hiển thị ảnh đầy đủ với text overlay
Hệ thống SHALL hiển thị ảnh banner ở `opacity: 100%` với overlay tối nhẹ để text dễ đọc, thay vì ảnh mờ 30% trên gradient.

#### Scenario: Ảnh banner hiển thị rõ
- **WHEN** banner có image_url
- **THEN** ảnh hiển thị đầy đủ, text title/subtitle nằm trên overlay `bg-black/40`
