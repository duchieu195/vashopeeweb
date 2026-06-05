# Dynamic Product Variants

## Tóm tắt

Cho phép admin tự tạo các nhóm phân loại sản phẩm hoàn toàn linh hoạt (tên nhóm, giá trị tùy ý), hệ thống tự sinh tổ hợp biến thể (variants). Mỗi variant có giá, tồn kho, ảnh, SKU riêng. Frontend hiển thị selector phân loại, cập nhật giá/ảnh/tồn kho theo variant được chọn. Giỏ hàng và đơn hàng lưu đúng variant đã chọn.

## Mục tiêu

- Admin tự đặt tên nhóm phân loại bất kỳ (không hard-code)
- Admin tự thêm giá trị cho từng nhóm
- Hệ thống tự sinh danh sách variant theo tổ hợp (cartesian product)
- Mỗi variant có giá, giá khuyến mãi, tồn kho, ảnh, SKU riêng
- Frontend: chọn phân loại → giá/ảnh/tồn kho thay đổi theo variant
- Giỏ hàng và đơn hàng lưu đúng variant đã chọn
- Sản phẩm không có phân loại vẫn hoạt động bình thường

## Ngoài phạm vi

- Import/export variants hàng loạt
- Variant ảnh hưởng đến SEO URL
- Giới hạn số lượng nhóm phân loại hoặc giá trị

## Các quyết định thiết kế

| Điểm | Quyết định | Lý do |
|------|-----------|-------|
| Ảnh variant | Mỗi variant có thể có ảnh riêng (optional), fallback về ảnh sản phẩm | Cần thiết cho sản phẩm có màu sắc khác nhau |
| Xóa option value | Soft-deactivate variants liên quan (`is_active = false`), không xóa hẳn | An toàn cho đơn hàng cũ đã đặt |
| Giá trên listing | Hiển thị "Từ X₫" = min(variant.price) khi has_variants=true | Phổ biến, không gây nhầm lẫn |
| Cart cũ | Thêm `version` vào localStorage, auto-clear nếu format cũ | Đơn giản, cart là ephemeral state |

## Phạm vi thay đổi

- **Database**: 4 bảng mới + cột `has_variants` trên `products` + RLS policies
- **Admin**: Mở rộng ProductCreate/Edit với Option Group Builder + Variant Table
- **Frontend**: ProductDetailPage (variant selector), CartStore (variant-aware), CheckoutPage (lưu variant)
- **Types**: Thêm interfaces cho variants, options, cart item mới
