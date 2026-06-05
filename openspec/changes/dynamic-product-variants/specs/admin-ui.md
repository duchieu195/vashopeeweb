# Spec: Admin UI

## Tổng quan thay đổi

`ProductCreate.tsx` và `ProductEdit.tsx` được mở rộng với section "Phân loại sản phẩm" phía dưới các trường hiện tại.

## Section "Phân loại sản phẩm"

### Toggle bật/tắt

```
┌─────────────────────────────────────────────────────┐
│ Phân loại sản phẩm                    [Toggle OFF]  │
│ Bật để thêm các nhóm phân loại (màu, size, v.v.)   │
└─────────────────────────────────────────────────────┘
```

Khi toggle OFF: ẩn toàn bộ section bên dưới. Trường giá/tồn kho mặc định của product vẫn hiển thị và bắt buộc.

Khi toggle ON: hiện Option Group Builder. Trường giá/tồn kho mặc định của product vẫn giữ (dùng làm fallback và để tính min price).

### Option Group Builder

```
┌─────────────────────────────────────────────────────┐
│ Nhóm phân loại                    [+ Thêm nhóm]    │
├─────────────────────────────────────────────────────┤
│ ☰  Kích thước              [Sửa tên] [Xóa nhóm]   │
│    ┌──────────────────────────────────────────────┐ │
│    │ 420ml  [x]   680ml  [x]   [+ Thêm giá trị]  │ │
│    └──────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ ☰  Loại                    [Sửa tên] [Xóa nhóm]   │
│    ┌──────────────────────────────────────────────┐ │
│    │ Gội phục hồi [x]  Dầu xả [x]  [+ Thêm]     │ │
│    └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Hành vi:**
- "☰" = drag handle để reorder nhóm (dùng `@dnd-kit/sortable` hoặc Ant Design `SortableList`)
- "Sửa tên": inline edit tên nhóm (click → input field)
- "Xóa nhóm": confirm dialog → xóa nhóm + tất cả giá trị + deactivate variants liên quan
- "+ Thêm giá trị": thêm tag input, nhấn Enter hoặc blur để confirm
- "[x]" trên tag: xóa giá trị → deactivate variants liên quan
- Giá trị trong nhóm có thể drag để reorder

### Nút "Tạo biến thể"

Hiển thị sau khi có ít nhất 1 nhóm với ít nhất 1 giá trị:

```
┌─────────────────────────────────────────────────────┐
│ [Tạo biến thể tự động]                              │
│ Sẽ tạo 4 biến thể từ 2 nhóm × 2 giá trị           │
└─────────────────────────────────────────────────────┘
```

Logic:
- Tính cartesian product của tất cả option values
- Nếu đã có variants: chỉ thêm variants mới (tổ hợp chưa tồn tại), giữ nguyên variants cũ
- Hiển thị confirm nếu sẽ tạo > 20 variants

### Variant Table

Hiển thị sau khi có variants:

```
┌──────────────────┬──────────┬──────────────┬──────────────┬────────┬──────┬────────┐
│ Biến thể         │ SKU      │ Giá bán (₫)  │ Giá gốc (₫) │ Tồn   │ Ảnh  │ Trạng  │
├──────────────────┼──────────┼──────────────┼──────────────┼────────┼──────┼────────┤
│ 420ml/Gội phục hồi│ SP001-A │ 150,000      │ 180,000      │ 50    │ [+]  │ ● Bật  │
│ 420ml/Dầu xả    │ SP001-B  │ 140,000      │ 170,000      │ 30    │ [+]  │ ● Bật  │
│ 680ml/Gội phục hồi│ SP001-C │ 220,000      │ 260,000      │ 20    │ [+]  │ ● Bật  │
│ 680ml/Dầu xả    │ SP001-D  │ 210,000      │ 250,000      │ 15    │ [+]  │ ● Bật  │
└──────────────────┴──────────┴──────────────┴──────────────┴────────┴──────┴────────┘
```

**Hành vi:**
- Tất cả cells (trừ "Biến thể") là editable inline
- Cột "Ảnh": click "[+]" → upload ảnh cho variant đó (tối đa 3 ảnh/variant). Nếu không upload, fallback về ảnh sản phẩm
- Cột "Trạng thái": toggle bật/tắt variant (is_active)
- Variants bị deactivate do xóa option value hiển thị màu xám với tooltip giải thích

### Lưu dữ liệu (ProductEdit)

Khi admin nhấn "Lưu":
1. Lưu product (bao gồm `has_variants`)
2. Upsert option groups (theo product_id)
3. Upsert option values (theo group_id)
4. Upsert variants (theo product_id)
5. Upsert variant_options (junction)
6. Xóa groups/values/variants đã bị remove khỏi form
7. Cập nhật `products.price = min(active variant prices)` nếu has_variants=true

### Validation

- Khi has_variants=true: phải có ít nhất 1 nhóm với ít nhất 1 giá trị
- Khi has_variants=true: phải có ít nhất 1 variant active
- Mỗi variant phải có price > 0
- Tên nhóm không được trùng trong cùng một sản phẩm

## Admin - Order Display

Trong `OrderShow.tsx`, cột "Sản phẩm" trong order items hiển thị thêm `variant_label`:

```
Dầu gội Sunsilk
420ml / Gội phục hồi    ← variant_label (màu xám, nhỏ hơn)
x2 — 300,000₫
```
