## ADDED Requirements

### Requirement: Admin có thể xem danh sách banner
Hệ thống SHALL hiển thị danh sách tất cả banner trong admin với các cột: ảnh thumbnail, tiêu đề, phụ đề, thứ tự, trạng thái (active/inactive), và các action sửa/xóa.

#### Scenario: Xem danh sách banner
- **WHEN** admin vào mục "Banner" trong sidebar
- **THEN** hiển thị bảng danh sách banner với ảnh thumbnail, title, subtitle, sort_order, is_active badge

### Requirement: Admin có thể tạo banner mới
Hệ thống SHALL cho phép admin tạo banner mới với đầy đủ thông tin và upload ảnh lên Supabase Storage.

#### Scenario: Tạo banner với đầy đủ thông tin
- **WHEN** admin điền title, subtitle, sort_order, upload ảnh và nhấn Lưu
- **THEN** banner được lưu vào bảng `banners` với `image_url` là URL public từ Supabase Storage

#### Scenario: Hiển thị gợi ý kích thước ảnh
- **WHEN** admin ở form tạo/sửa banner, nhìn vào field upload ảnh
- **THEN** hiển thị text gợi ý "Kích thước khuyến nghị: 1200×400px (tỉ lệ 3:1)"

### Requirement: Admin có thể sửa banner
Hệ thống SHALL cho phép admin sửa tất cả các trường của banner bao gồm thay ảnh mới.

#### Scenario: Sửa tiêu đề banner
- **WHEN** admin sửa title/subtitle và nhấn Lưu
- **THEN** banner được cập nhật, hiển thị thay đổi ngay trên danh sách

### Requirement: Admin có thể bật/tắt banner
Hệ thống SHALL cho phép toggle trạng thái `is_active` trực tiếp từ form edit.

#### Scenario: Tắt banner
- **WHEN** admin tắt switch is_active và lưu
- **THEN** banner có `is_active = false` và không hiện trên storefront

### Requirement: Admin có thể xóa banner
Hệ thống SHALL cho phép xóa banner từ danh sách.

#### Scenario: Xóa banner
- **WHEN** admin nhấn xóa và xác nhận
- **THEN** banner bị xóa khỏi database
