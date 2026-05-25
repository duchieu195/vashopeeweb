-- Add variant support to products
ALTER TABLE products
  ADD COLUMN has_variants boolean NOT NULL DEFAULT false;

-- Option groups (admin-defined, e.g. "Kích thước", "Màu sắc")
CREATE TABLE product_option_groups (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name          text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX product_option_groups_product_id_idx ON product_option_groups(product_id);

-- Option values within a group (e.g. "420ml", "680ml")
CREATE TABLE product_option_values (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id      uuid NOT NULL REFERENCES product_option_groups(id) ON DELETE CASCADE,
  value         text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX product_option_values_group_id_idx ON product_option_values(group_id);

-- Product variants (one per combination of option values)
CREATE TABLE product_variants (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku            text,
  price          integer NOT NULL CHECK (price >= 0),
  original_price integer CHECK (original_price >= 0),
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  images         text[] NOT NULL DEFAULT '{}',
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz DEFAULT now()
);

CREATE INDEX product_variants_product_id_idx ON product_variants(product_id);
CREATE INDEX product_variants_is_active_idx  ON product_variants(is_active);

-- Junction: which option values make up each variant
CREATE TABLE product_variant_options (
  variant_id      uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  option_value_id uuid NOT NULL REFERENCES product_option_values(id) ON DELETE CASCADE,
  PRIMARY KEY (variant_id, option_value_id)
);

CREATE INDEX product_variant_options_option_value_id_idx ON product_variant_options(option_value_id);

-- Capture variant info on order items
ALTER TABLE order_items
  ADD COLUMN variant_id    uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  ADD COLUMN variant_label text;
