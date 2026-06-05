## 1. CheckoutPage — Logic tính toán

- [x] 1.1 Thêm hằng số `SHIPPING_FEE = 15000` vào đầu file `CheckoutPage.tsx`
- [x] 1.2 Cập nhật công thức `finalTotal` thành `total - discountAmount + SHIPPING_FEE`

## 2. CheckoutPage — UI Order Summary

- [x] 2.1 Thêm dòng "Phí vận chuyển: 15.000đ" vào bảng tóm tắt, nằm giữa "Tạm tính" và dòng giảm giá (nếu có)
- [x] 2.2 Xác nhận dòng "Thanh toán" hiển thị đúng `finalTotal` (đã bao gồm phí ship)

## 3. Kiểm tra

- [x] 3.1 Kiểm tra luồng không có coupon: tổng = sản phẩm + 15.000đ
- [x] 3.2 Kiểm tra luồng có coupon: tổng = sản phẩm - giảm giá + 15.000đ
- [x] 3.3 Xác nhận số tiền QR hiển thị đúng (bao gồm phí ship)
