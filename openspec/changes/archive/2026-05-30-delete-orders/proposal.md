## Why

Admin cần xoá các đơn hàng được tạo do lỗi (test, nhập sai) để giữ dữ liệu sạch. Hiện tại không có cách nào xoá đơn trong giao diện admin.

## What Changes

- Thêm nút **Xoá** kèm Popconfirm xác nhận vào cột "Thao tác" trong danh sách đơn hàng (`OrderList`)
- Thêm nút **Xoá** kèm Popconfirm xác nhận vào header trang chi tiết đơn hàng (`OrderShow`), sau khi xoá redirect về `/orders`

## Capabilities

### New Capabilities

- `order-deletion`: Xoá cứng đơn hàng từ giao diện admin — áp dụng cho mọi trạng thái, chỉ admin được thực hiện

### Modified Capabilities

_(không có)_

## Impact

- `vashopeeweb-admin/src/pages/orders/OrderList.tsx` — thêm cột thao tác
- `vashopeeweb-admin/src/pages/orders/OrderShow.tsx` — thêm header button
- Không cần migration: RLS `orders_admin_all` đã cover `DELETE`, `order_items` có `ON DELETE CASCADE`
