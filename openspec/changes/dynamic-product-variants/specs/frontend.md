# Spec: Frontend

## Types mới (vashopeeweb-app/src/types/index.ts)

```typescript
export interface ProductOptionValue {
  id: string;
  groupId: string;
  value: string;
  displayOrder: number;
}

export interface ProductOptionGroup {
  id: string;
  productId: string;
  name: string;
  displayOrder: number;
  values: ProductOptionValue[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  images: string[];           // empty = fallback về product.images
  isActive: boolean;
  optionValueIds: string[];   // IDs của các option values tạo nên variant này
}

// CartItem mới — thêm variant fields
export interface CartItem {
  product: Product;
  variantId?: string;
  variantLabel?: string;      // snapshot: "420ml / Gội phục hồi"
  variantPrice?: number;      // snapshot giá tại thời điểm thêm vào giỏ
  quantity: number;
}
```

## ProductDetailPage

### Fetch data

```typescript
// Nếu product.has_variants = true, fetch thêm:
const { data: groups } = await supabase
  .from('product_option_groups')
  .select('*, product_option_values(*)')
  .eq('product_id', id)
  .order('display_order');

const { data: variants } = await supabase
  .from('product_variants')
  .select('*, product_variant_options(option_value_id)')
  .eq('product_id', id)
  .eq('is_active', true);
```

### UI Variant Selector

Hiển thị phía trên QuantitySelector, chỉ khi `product.has_variants = true`:

```
┌─────────────────────────────────────────────────────┐
│ Kích thước                                          │
│  [420ml]  [ 680ml ]                                 │
│                                                     │
│ Loại                                                │
│  [Gội phục hồi]  [ Dầu xả ]  [ Gội giảm gàu ]    │
└─────────────────────────────────────────────────────┘
```

- Mỗi nhóm hiển thị tên nhóm + các button option values
- Button được chọn: highlighted (bg-primary text-white)
- Button không có stock (variant tương ứng hết hàng): disabled + gạch chân
- Khi chọn đủ tất cả nhóm → tìm variant khớp → cập nhật giá/ảnh/tồn kho

### Logic tìm variant khớp

```typescript
function findMatchingVariant(
  variants: ProductVariant[],
  selectedOptionValueIds: string[]
): ProductVariant | undefined {
  return variants.find((v) =>
    selectedOptionValueIds.every((id) => v.optionValueIds.includes(id)) &&
    v.optionValueIds.length === selectedOptionValueIds.length
  );
}
```

### Cập nhật hiển thị khi chọn variant

```
selectedVariant = findMatchingVariant(...)

displayPrice     = selectedVariant?.price ?? product.price
displayOrigPrice = selectedVariant?.originalPrice ?? product.originalPrice
displayImages    = selectedVariant?.images.length > 0
                   ? selectedVariant.images
                   : product.images
displayStock     = selectedVariant?.stockQuantity ?? product.stockQuantity
```

### Nút "Thêm vào giỏ hàng"

- `has_variants = false`: hoạt động như hiện tại
- `has_variants = true` + chưa chọn đủ options: disabled, text "Vui lòng chọn phân loại"
- `has_variants = true` + đã chọn đủ + hết hàng: disabled, text "Hết hàng"
- `has_variants = true` + đã chọn đủ + còn hàng: enabled

### handleAddToCart khi có variant

```typescript
const handleAddToCart = () => {
  if (product.hasVariants && !selectedVariant) return;

  addItem(product, quantity, selectedVariant ? {
    variantId: selectedVariant.id,
    variantLabel: computeVariantLabel(selectedVariant, optionGroups),
    variantPrice: selectedVariant.price,
  } : undefined);

  setAdded(true);
  openCart();
  setTimeout(() => setAdded(false), 2000);
};
```

## CartStore (vashopeeweb-app/src/store/cartStore.ts)

### Cart version migration

```typescript
const CART_VERSION = 2;

// Trong persist config:
onRehydrateStorage: () => (state) => {
  if (state && (state as any).version !== CART_VERSION) {
    state.items = [];
    state.version = CART_VERSION;
  }
}
```

### Cart item key

```typescript
function cartKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}__${variantId}` : productId;
}
```

### addItem signature mới

```typescript
addItem: (
  product: Product,
  quantity?: number,
  variant?: { variantId: string; variantLabel: string; variantPrice: number }
) => void;
```

Logic: tìm existing item theo `cartKey(product.id, variant?.variantId)`. Nếu có → tăng quantity. Nếu không → thêm mới.

### removeItem / updateQuantity

Nhận thêm `variantId?: string` để định danh đúng item.

### totalPrice

```typescript
totalPrice: () =>
  get().items.reduce((sum, i) => {
    const price = i.variantPrice ?? i.product.price;
    return sum + price * i.quantity;
  }, 0),
```

## CartSidebar / CartItem component

Hiển thị thêm `variantLabel` dưới tên sản phẩm (nếu có):

```
Dầu gội Sunsilk
420ml / Gội phục hồi    ← text-xs text-gray-400
x1 — 150,000₫
```

## CheckoutPage

### Order items insert

```typescript
await supabase.from('order_items').insert(
  items.map((item) => ({
    order_id: orderData.id,
    product_id: item.product.id,
    product_name: item.product.name,
    product_image: item.product.images[0] ?? null,
    quantity: item.quantity,
    price_at_purchase: item.variantPrice ?? item.product.price,
    variant_id: item.variantId ?? null,
    variant_label: item.variantLabel ?? null,
  }))
);
```

### Order summary display

Hiển thị `variantLabel` dưới tên sản phẩm trong phần tóm tắt đơn hàng (bên phải form checkout).

## ProductCard (listing)

Khi `product.has_variants = true`, hiển thị "Từ " trước giá:

```typescript
const pricePrefix = product.hasVariants ? 'Từ ' : '';
// product.price đã được cập nhật = min(variant prices) bởi admin
```
