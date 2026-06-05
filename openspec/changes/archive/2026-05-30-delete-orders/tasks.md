## 1. OrderList — Thêm cột thao tác xoá

- [x] 1.1 Import `useDelete` từ `@refinedev/core` và `Popconfirm`, `Button` từ `antd` vào `OrderList.tsx`
- [x] 1.2 Khởi tạo `useDelete` hook trong component
- [x] 1.3 Thêm `Table.Column` "Thao tác" với `Popconfirm` bao quanh nút Xoá, gọi `mutate({ resource: 'orders', id: record.id })` khi xác nhận

## 2. OrderShow — Thêm nút xoá ở header

- [x] 2.1 Import `useDelete` từ `@refinedev/core`, `Popconfirm`, `Button` từ `antd`, và `useNavigate` từ `react-router-dom` vào `OrderShow.tsx`
- [x] 2.2 Khởi tạo `useDelete` hook và `useNavigate` trong component
- [x] 2.3 Thêm nút Xoá vào `headerButtons` prop của `<Show>`, dùng `Popconfirm` xác nhận, sau khi xoá thành công gọi `navigate('/orders')`
