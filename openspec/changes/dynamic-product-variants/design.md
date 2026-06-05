# Design: Dynamic Product Variants

## Mô hình dữ liệu

```
products
├── has_variants: boolean (NEW)   ← false = dùng price/stock/images của product
└── price, stock_quantity, images ← vẫn giữ, dùng khi has_variants=false

product_option_groups (NEW)
├── id: uuid
├── product_id: text → products.id
├── name: text                    ← admin tự đặt, ví dụ "Kích thước"
└── display_order: integer

product_option_values (NEW)
├── id: uuid
├── group_id: uuid → product_option_groups.id
├── value: text                   ← admin tự đặt, ví dụ "420ml"
└── display_order: integer

product_variants (NEW)
├── id: uuid
├── product_id: text → products.id
├── sku: text (nullable)
├── price: integer
├── original_price: integer (nullable)
├── stock_quantity: integer
├── images: text[]                ← optional, fallback về product.images
└── is_active: boolean

product_variant_options (NEW, junction)
├── variant_id: uuid → product_variants.id
└── option_value_id: uuid → product_option_values.id
    PRIMARY KEY (variant_id, option_value_id)
```

## Quan hệ ví dụ

```
Product "Dầu gội" (has_variants=true)
│
├── OptionGroup "Kích thước" (order=0)
│   ├── OptionValue "420ml" (order=0)
│   └── OptionValue "680ml" (order=1)
│
├── OptionGroup "Loại" (order=1)
│   ├── OptionValue "Gội phục hồi" (order=0)
│   └── OptionValue "Dầu xả" (order=1)
│
└── Variants (auto-generated, 2×2=4)
    ├── Variant A → {420ml, Gội phục hồi} → price=150k, stock=50
    ├── Variant B → {420ml, Dầu xả}       → price=140k, stock=30
    ├── Variant C → {680ml, Gội phục hồi} → price=220k, stock=20
    └── Variant D → {680ml, Dầu xả}       → price=210k, stock=15
```

## Variant label

Tính toán runtime bằng cách join các option values theo `display_order` của group:

```
variant.optionValues
  .sort by group.display_order
  .map(v => v.value)
  .join(" / ")
→ "420ml / Gội phục hồi"
```

## Cart item identity

Cart item được định danh bằng `${product.id}__${variant.id}` (hoặc chỉ `product.id` nếu không có variant). Hai items cùng product nhưng khác variant là hai entries riêng biệt.

```typescript
interface CartItem {
  product: Product;
  variantId?: string;
  variantLabel?: string;       // snapshot: "420ml / Gội phục hồi"
  variantPrice?: number;       // snapshot tại thời điểm thêm vào giỏ
  quantity: number;
}
```

## Giá hiển thị trên listing

```
has_variants = false → product.price (hiện tại)
has_variants = true  → min(active variants price) với prefix "Từ "
```

Để tránh N+1 query, thêm computed column hoặc denormalize `min_variant_price` vào products. Phương án đơn giản hơn: fetch variants khi cần (chỉ trên ProductDetailPage), listing dùng `product.price` làm fallback.

**Quyết định**: Khi admin generate/update variants, tự động cập nhật `products.price = min(variant.price)`. Listing vẫn dùng `product.price`, không cần query thêm.

## Soft-delete khi xóa option value

```
Admin xóa OptionValue "420ml"
→ Tìm tất cả variants có option_value_id = "420ml"
→ SET is_active = false cho các variants đó
→ Xóa OptionValue
→ Admin thấy variants bị deactivate, có thể xóa thủ công
```

## Cart version migration

```typescript
// cartStore.ts
const CART_VERSION = 2;

// Khi load từ localStorage:
if (stored.version !== CART_VERSION) {
  return { items: [], version: CART_VERSION };
}
```

## Order items schema thay đổi

Thêm 2 cột vào `order_items`:
- `variant_id uuid` (nullable, references product_variants)
- `variant_label text` (nullable, snapshot: "420ml / Gội phục hồi")

## Luồng dữ liệu frontend

```
ProductDetailPage load
  → fetch product (has_variants, price, images, stock)
  → if has_variants: fetch option_groups + option_values + variants

User chọn option values
  → selectedOptions: { [groupId]: optionValueId }
  → khi đủ tất cả groups: tìm variant khớp
  → cập nhật hiển thị: price, images, stock từ variant

User "Thêm vào giỏ"
  → addItem(product, quantity, variant?)
  → cart key = product.id + variant.id

Checkout
  → order_items bao gồm variant_id, variant_label
```

## Luồng admin tạo variant

```
1. Admin bật "Sản phẩm có phân loại"
2. Thêm nhóm phân loại (ví dụ: "Màu sắc")
3. Thêm giá trị vào nhóm (ví dụ: "Đen", "Trắng")
4. Thêm nhóm thứ 2 (ví dụ: "Size")
5. Thêm giá trị (ví dụ: "M", "L")
6. Nhấn "Tạo biến thể" → hệ thống sinh 4 variants
7. Admin chỉnh giá/tồn kho/SKU/ảnh cho từng variant
8. Lưu
```

## RLS Policies

- `product_option_groups`, `product_option_values`, `product_variants`, `product_variant_options`: public SELECT, authenticated INSERT/UPDATE/DELETE (giống pattern hiện tại của products)
