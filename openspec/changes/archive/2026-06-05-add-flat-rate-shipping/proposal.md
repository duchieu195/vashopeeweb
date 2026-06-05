## Why

Hiện tại trang Checkout không hiển thị phí vận chuyển, khiến khách hàng không biết tổng số tiền thực tế phải thanh toán. Thêm phí ship đồng giá 15.000đ/đơn giúp minh bạch hóa chi phí và đảm bảo tổng thanh toán phản ánh đúng giá trị đơn hàng.

## What Changes

- Thêm hằng số phí ship đồng giá **15.000đ** vào `CheckoutPage`
- Hiển thị dòng "Phí vận chuyển" trong bảng tóm tắt đơn hàng (order summary)
- Tính `finalTotal = subtotal - discount + shippingFee` thay vì `subtotal - discount`
- Số tiền QR thanh toán (`QRPayment`) phản ánh `finalTotal` đã bao gồm phí ship
- Số tiền lưu vào `orders.total_amount` bao gồm phí ship
- CartSidebar **không thay đổi** (chỉ hiển thị tạm tính sản phẩm, chưa tính ship)

## Capabilities

### New Capabilities
- `flat-rate-shipping`: Hiển thị và tính phí vận chuyển đồng giá 15.000đ vào tổng thanh toán tại trang Checkout

### Modified Capabilities
<!-- Không có capability hiện tại nào thay đổi yêu cầu -->

## Impact

- `vashopeeweb-app/src/pages/CheckoutPage.tsx` — thêm hằng số, cập nhật tính toán `finalTotal`, cập nhật UI order summary
- Không ảnh hưởng đến `CartSidebar` (hiển thị tạm tính, chưa tính ship là hợp lý)
- Không ảnh hưởng database schema (phí ship được cộng vào `total_amount`)
