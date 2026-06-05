### Requirement: Admin có thể xoá đơn hàng từ danh sách
Admin SHALL được xoá bất kỳ đơn hàng nào (mọi trạng thái) từ trang danh sách đơn hàng. Hệ thống MUST hiển thị hộp thoại xác nhận trước khi thực hiện xoá.

#### Scenario: Xoá đơn từ danh sách
- **WHEN** admin nhấn nút Xoá trên một row trong OrderList
- **THEN** hệ thống hiển thị Popconfirm yêu cầu xác nhận

#### Scenario: Xác nhận xoá từ danh sách
- **WHEN** admin xác nhận trong Popconfirm
- **THEN** hệ thống xoá cứng đơn hàng và các order_items liên quan, row biến mất khỏi bảng

#### Scenario: Huỷ xoá từ danh sách
- **WHEN** admin nhấn Huỷ trong Popconfirm
- **THEN** không có thay đổi nào xảy ra

### Requirement: Admin có thể xoá đơn hàng từ trang chi tiết
Admin SHALL được xoá đơn hàng đang xem từ trang chi tiết (`OrderShow`). Sau khi xoá thành công, hệ thống MUST chuyển hướng về trang danh sách đơn hàng.

#### Scenario: Xoá đơn từ trang chi tiết
- **WHEN** admin nhấn nút Xoá ở header của OrderShow
- **THEN** hệ thống hiển thị Popconfirm yêu cầu xác nhận

#### Scenario: Xác nhận xoá từ trang chi tiết
- **WHEN** admin xác nhận trong Popconfirm
- **THEN** hệ thống xoá cứng đơn hàng, sau đó redirect về `/orders`

#### Scenario: Huỷ xoá từ trang chi tiết
- **WHEN** admin nhấn Huỷ trong Popconfirm
- **THEN** không có thay đổi nào xảy ra, admin ở lại trang chi tiết
