-- Enable RLS on variant tables
ALTER TABLE product_option_groups  ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_values  ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants       ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variant_options ENABLE ROW LEVEL SECURITY;

-- ─── PRODUCT OPTION GROUPS ────────────────────────────────────
CREATE POLICY "option_groups_public_read"
  ON product_option_groups FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "option_groups_admin_all"
  ON product_option_groups FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ─── PRODUCT OPTION VALUES ────────────────────────────────────
CREATE POLICY "option_values_public_read"
  ON product_option_values FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "option_values_admin_all"
  ON product_option_values FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ─── PRODUCT VARIANTS ─────────────────────────────────────────
-- Public (anon) can only see active variants
CREATE POLICY "variants_public_read_active"
  ON product_variants FOR SELECT
  TO anon
  USING (is_active = true);

-- Authenticated admin can see all variants (including inactive)
CREATE POLICY "variants_admin_read_all"
  ON product_variants FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "variants_admin_all"
  ON product_variants FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ─── PRODUCT VARIANT OPTIONS (junction) ───────────────────────
CREATE POLICY "variant_options_public_read"
  ON product_variant_options FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "variant_options_admin_all"
  ON product_variant_options FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
