## Context

Admin dashboard dùng Refine framework với Supabase. Hiện tại `OrderList` và `OrderShow` không có chức năng xoá. RLS `orders_admin_all` đã cover `DELETE` cho authenticated admin, và `order_items` có `ON DELETE CASCADE` — không cần migration.

## Goals / Non-Goals

**Goals:**
- Thêm xoá cứng đơn hàng tại `OrderList` (cột thao tác, mỗi row)
- Thêm xoá cứng đơn hàng tại `OrderShow` (header button)
- Xác nhận bằng Popconfirm trước khi xoá

**Non-Goals:**
- Xoá mềm (soft delete)
- Xoá hàng loạt (bulk delete)
- Giới hạn theo trạng thái đơn hàng
- Xoá từ Dashboard widget

## Decisions

**Dùng `useDelete` hook của Refine thay vì gọi Supabase trực tiếp**
Refine tự động invalidate cache/query sau khi xoá, giữ nhất quán với pattern hiện tại của codebase (`useUpdate` đã dùng trong `OrderShow`).

**Popconfirm của Ant Design thay vì Modal**
Nhẹ hơn, inline, phù hợp cho hành động đơn lẻ trên row. Modal phù hợp hơn cho bulk action hoặc form phức tạp.

**Redirect sau khi xoá ở `OrderShow`**
Dùng `useNavigate` từ `react-router-dom` để redirect về `/orders` sau khi `useDelete` thành công — tránh user ở lại trang của đơn đã bị xoá.

## Risks / Trade-offs

- **Xoá vĩnh viễn không khôi phục được** → Popconfirm là lớp bảo vệ duy nhất; đủ cho use case "dọn đơn lỗi" của admin
- **Cascade xoá order_items** → Đây là hành vi mong muốn, đã được xác nhận qua constraint DB
