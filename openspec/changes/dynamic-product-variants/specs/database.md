# Spec: Database Migration

## Migration file: `004_product_variants.sql`

### Thay đổi bảng products

```sql
ALTER TABLE products
  ADD COLUMN has_variants boolean NOT NULL DEFAULT false;
```

### Bảng product_option_groups

```sql
CREATE TABLE product_option_groups (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name         text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX product_option_groups_product_id_idx ON product_option_groups(product_id);
```

### Bảng product_option_values

```sql
CREATE TABLE product_option_values (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id      uuid NOT NULL REFERENCES product_option_groups(id) ON DELETE CASCADE,
  value         text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX product_option_values_group_id_idx ON product_option_values(group_id);
```

### Bảng product_variants

```sql
CREATE TABLE product_variants (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku            text,
  price          integer NOT NULL,
  original_price integer,
  stock_quantity integer NOT NULL DEFAULT 0,
  images         text[] NOT NULL DEFAULT '{}',
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz DEFAULT now()
);

CREATE INDEX product_variants_product_id_idx ON product_variants(product_id);
CREATE INDEX product_variants_is_active_idx ON product_variants(is_active);
```

### Bảng product_variant_options (junction)

```sql
CREATE TABLE product_variant_options (
  variant_id      uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  option_value_id uuid NOT NULL REFERENCES product_option_values(id) ON DELETE CASCADE,
  PRIMARY KEY (variant_id, option_value_id)
);

CREATE INDEX product_variant_options_option_value_id_idx ON product_variant_options(option_value_id);
```

### Thay đổi bảng order_items

```sql
ALTER TABLE order_items
  ADD COLUMN variant_id    uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  ADD COLUMN variant_label text;
```

## RLS Policies (migration file: `005_variants_rls.sql`)

```sql
-- product_option_groups
ALTER TABLE product_option_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read option groups" ON product_option_groups FOR SELECT USING (true);
CREATE POLICY "auth manage option groups" ON product_option_groups FOR ALL USING (auth.role() = 'authenticated');

-- product_option_values
ALTER TABLE product_option_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read option values" ON product_option_values FOR SELECT USING (true);
CREATE POLICY "auth manage option values" ON product_option_values FOR ALL USING (auth.role() = 'authenticated');

-- product_variants
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "auth read all variants" ON product_variants FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth manage variants" ON product_variants FOR ALL USING (auth.role() = 'authenticated');

-- product_variant_options
ALTER TABLE product_variant_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read variant options" ON product_variant_options FOR SELECT USING (true);
CREATE POLICY "auth manage variant options" ON product_variant_options FOR ALL USING (auth.role() = 'authenticated');
```

## Constraints

- `product_option_groups.name`: không được rỗng
- `product_option_values.value`: không được rỗng
- `product_variants.price`: >= 0
- `product_variants.stock_quantity`: >= 0
- Một variant phải có đúng một option value từ mỗi group của product (enforced ở application layer, không phải DB constraint)
