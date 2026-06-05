# Tasks: Dynamic Product Variants

## Phase 1 — Database

- [x] **T01** Viết migration `004_product_variants.sql`
  - Thêm cột `has_variants boolean DEFAULT false` vào `products`
  - Tạo bảng `product_option_groups`
  - Tạo bảng `product_option_values`
  - Tạo bảng `product_variants`
  - Tạo bảng `product_variant_options` (junction)
  - Thêm cột `variant_id`, `variant_label` vào `order_items`
  - Tạo tất cả indexes

- [x] **T02** Viết migration `005_variants_rls.sql`
  - RLS policies cho 4 bảng mới (public SELECT, authenticated ALL)
  - `product_variants`: public chỉ SELECT `is_active = true`; authenticated SELECT tất cả

- [x] **T03** Apply migrations lên Supabase (local dev) — *manual: chạy `supabase db push` khi Docker sẵn sàng*

## Phase 2 — Types & Shared

- [x] **T04** Cập nhật `vashopeeweb-app/src/types/index.ts`
  - Thêm `ProductOptionGroup`, `ProductOptionValue`, `ProductVariant`
  - Cập nhật `CartItem` (thêm `variantId?`, `variantLabel?`, `variantPrice?`)
  - Thêm `hasVariants?: boolean` vào `Product`

## Phase 3 — Admin: Option Group Builder

- [x] **T05** Tạo component `OptionGroupBuilder.tsx` trong admin
  - Toggle bật/tắt `has_variants`
  - Thêm/sửa/xóa/reorder nhóm phân loại
  - Thêm/sửa/xóa/reorder giá trị trong nhóm
  - Dùng Ant Design `SortableList` hoặc `@dnd-kit/sortable` cho drag-to-reorder

- [x] **T06** Tích hợp `OptionGroupBuilder` vào `ProductCreate.tsx`
  - Hiển thị section sau các trường hiện tại
  - State quản lý groups/values local (chưa lưu DB)

- [x] **T07** Tích hợp `OptionGroupBuilder` vào `ProductEdit.tsx`
  - Fetch groups + values hiện tại khi load form
  - Hiển thị và cho phép chỉnh sửa

## Phase 4 — Admin: Variant Table

- [x] **T08** Tạo component `VariantTable.tsx` trong admin
  - Nút "Tạo biến thể tự động" (cartesian product)
  - Bảng editable: label, SKU, price, original_price, stock, images, is_active
  - Upload ảnh per-variant (tối đa 3 ảnh)
  - Toggle is_active per variant

- [x] **T09** Tích hợp `VariantTable` vào `ProductCreate.tsx`

- [x] **T10** Tích hợp `VariantTable` vào `ProductEdit.tsx`
  - Fetch variants + variant_options khi load
  - Xử lý soft-deactivate khi xóa option value

## Phase 5 — Admin: Save Logic

- [x] **T11** Viết `saveProductVariants` helper
  - Upsert option groups, option values, variants, variant_options
  - Xóa groups/values/variants đã bị remove
  - Cập nhật `products.price = min(active variant prices)` khi has_variants=true

- [x] **T12** Tích hợp `saveProductVariants` vào ProductCreate save flow

- [x] **T13** Tích hợp `saveProductVariants` vào ProductEdit save flow

## Phase 6 — Frontend: ProductDetailPage

- [x] **T14** Tạo hook `useProductVariants(productId)` trong app
  - Fetch option groups + values + variants khi `has_variants = true`
  - Return `{ groups, variants, loading }`

- [x] **T15** Tạo component `VariantSelector.tsx` trong app
  - Render nhóm phân loại + button options
  - Highlight selected, disable hết hàng
  - Emit `onSelectionChange(selectedOptionValueIds)`

- [x] **T16** Cập nhật `ProductDetailPage.tsx`
  - Tích hợp `VariantSelector` khi `has_variants = true`
  - Logic tìm variant khớp từ selection
  - Cập nhật giá/ảnh/tồn kho theo variant
  - Disable "Thêm vào giỏ" khi chưa chọn đủ hoặc hết hàng

## Phase 7 — Frontend: Cart & Checkout

- [x] **T17** Cập nhật `cartStore.ts`
  - Thêm cart version migration (CART_VERSION = 2)
  - Cập nhật `addItem` nhận thêm variant info
  - Cập nhật `removeItem`, `updateQuantity` nhận `variantId?`
  - Cập nhật `totalPrice` dùng `variantPrice ?? product.price`

- [x] **T18** Cập nhật `CartItem.tsx` component
  - Hiển thị `variantLabel` dưới tên sản phẩm

- [x] **T19** Cập nhật `CartSidebar.tsx`
  - Truyền `variantId` vào `removeItem` và `updateQuantity`

- [x] **T20** Cập nhật `CheckoutPage.tsx`
  - Thêm `variant_id`, `variant_label` vào order_items insert
  - Dùng `variantPrice ?? product.price` cho `price_at_purchase`
  - Hiển thị `variantLabel` trong order summary

## Phase 8 — Frontend: Listing

- [x] **T21** Cập nhật `ProductCard.tsx`
  - Hiển thị "Từ " prefix khi `product.has_variants = true`

## Phase 9 — Admin: Order Display

- [x] **T22** Cập nhật `OrderShow.tsx` (hoặc tương đương)
  - Hiển thị `variant_label` dưới tên sản phẩm trong order items

## Thứ tự thực hiện

```
T01 → T02 → T03 (DB phải xong trước)
T04 (types, song song với DB)
T05 → T06 → T07 (Option Group Builder)
T08 → T09 → T10 (Variant Table)
T11 → T12 → T13 (Save logic)
T14 → T15 → T16 (Frontend detail page)
T17 → T18 → T19 → T20 (Cart & Checkout)
T21 (Listing, độc lập)
T22 (Admin order, độc lập)
```
