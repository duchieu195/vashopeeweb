# Proposal: Coupon System

## Problem
Cần cơ chế giảm giá linh hoạt cho từng khách — chủ shop tự tạo mã, tự quyết định % giảm, bật/tắt tuỳ lúc. Khách nhập mã ở checkout, tổng tiền giảm ngay trước khi thanh toán.

## Solution
Thêm bảng `coupons` trong Supabase. Admin quản lý mã qua trang `/coupons` mới. Checkout thay ô "Ghi chú" bằng ô "Mã Giảm Giá". Telegram notification hiện thêm dòng mã giảm nếu đơn có dùng.

## Scope

### Database
- Bảng mới `coupons`: `code` (unique), `discount` (int, %), `is_active` (bool)
- Thêm 2 cột vào `orders`: `coupon_code` (text nullable), `discount_amount` (int nullable)
- RLS: anon SELECT WHERE is_active=true; admin full CRUD

### Admin (`vashopeeweb-admin`)
- Trang `/coupons`: list mã + % + toggle bật/tắt inline
- Trang `/coupons/create`: form nhập code + discount%
- Thêm vào sidebar menu

### Checkout (`vashopeeweb-app`)
- Thay textarea "Ghi chú" bằng input "Mã Giảm Giá" + nút "Áp dụng"
- Validate mã realtime: query Supabase, hiện feedback hợp lệ/không hợp lệ
- Cập nhật hiển thị tổng: dòng gốc, dòng giảm, dòng thanh toán
- Khi submit: lưu `coupon_code` + `discount_amount`, `total_amount` = giá sau giảm

### Telegram (`notify-telegram`)
- Nếu đơn có `coupon_code`: thêm dòng `🏷 Mã giảm: CODE (-X% = -Y₫)` vào message

## Out of scope
- Giới hạn số lần dùng
- Ngày hết hạn
- Giảm theo số tiền cố định
