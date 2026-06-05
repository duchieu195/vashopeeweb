## ADDED Requirements

### Requirement: Phí vận chuyển đồng giá hiển thị trong order summary
Hệ thống SHALL hiển thị một dòng "Phí vận chuyển" với số tiền cố định 15.000đ trong bảng tóm tắt đơn hàng tại trang Checkout.

#### Scenario: Hiển thị phí ship trong order summary
- **WHEN** khách hàng vào trang Checkout với giỏ hàng có sản phẩm
- **THEN** bảng tóm tắt hiển thị dòng "Phí vận chuyển: 15.000đ" giữa "Tạm tính" và "Thanh toán"

### Requirement: Tổng thanh toán bao gồm phí vận chuyển
Hệ thống SHALL tính tổng thanh toán cuối cùng bằng công thức: `tổng sản phẩm - giảm giá + 15.000đ phí ship`.

#### Scenario: Tổng thanh toán cộng phí ship không có coupon
- **WHEN** khách hàng có đơn hàng 100.000đ và không dùng mã giảm giá
- **THEN** tổng thanh toán hiển thị là 115.000đ

#### Scenario: Tổng thanh toán cộng phí ship sau khi áp dụng coupon
- **WHEN** khách hàng có đơn hàng 100.000đ và áp coupon giảm 10%
- **THEN** tổng thanh toán hiển thị là 100.000đ - 10.000đ + 15.000đ = 105.000đ

### Requirement: Số tiền QR và đơn hàng phản ánh tổng có phí ship
Hệ thống SHALL dùng `finalTotal` (đã bao gồm phí ship) làm số tiền cho mã QR thanh toán và lưu vào `orders.total_amount`.

#### Scenario: QR Payment hiển thị đúng số tiền
- **WHEN** khách hàng chuyển sang bước quét QR
- **THEN** mã QR và số tiền hiển thị bao gồm cả 15.000đ phí vận chuyển
