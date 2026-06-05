## Context

`CheckoutPage.tsx` hiện tính `finalTotal = total - discountAmount` và truyền thẳng vào `QRPayment` và `orders.total_amount`. Không có khái niệm phí vận chuyển. Phí ship sẽ được thêm vào như một hằng số hardcode (đồng giá, không có logic phức tạp).

## Goals / Non-Goals

**Goals:**
- Hiển thị dòng "Phí vận chuyển: 15.000đ" trong order summary
- Cộng phí ship vào `finalTotal` trước khi tạo đơn và hiển thị QR
- Giữ code đơn giản, không thêm abstraction không cần thiết

**Non-Goals:**
- Tính phí ship động theo địa chỉ/trọng lượng
- Cho phép miễn phí ship theo điều kiện (sẽ làm sau nếu cần)
- Thay đổi `CartSidebar` (tạm tính trong giỏ hàng chưa tính ship là UX hợp lý)
- Lưu `shipping_fee` riêng vào database

## Decisions

**Hardcode 15.000đ trong CheckoutPage**
- Thêm hằng số `SHIPPING_FEE = 15000` tại đầu file
- Tính `finalTotal = total - discountAmount + SHIPPING_FEE`
- Không đưa vào config hay database vì đây là giá cố định, đơn giản

**Không thêm cột database**
- `orders.total_amount` vẫn lưu tổng đã bao gồm phí ship
- Đủ để đối chiếu thanh toán, không cần tách riêng
- Thay đổi schema là overkill cho tính năng này

## Risks / Trade-offs

- Nếu sau này cần thay đổi phí ship → phải sửa code, nhưng đây là chấp nhận được vì shop đồng giá
- `CartSidebar` hiển thị tổng chưa bao gồm ship → khách thấy số khác ở giỏ hàng và checkout. Đây là trade-off chấp nhận được; nhiều shop lớn cũng làm vậy (phí ship chỉ hiện ở bước checkout).
