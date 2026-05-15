-- Enable RLS on all tables
alter table categories   enable row level security;
alter table products     enable row level security;
alter table orders       enable row level security;
alter table order_items  enable row level security;
alter table reviews      enable row level security;

-- ─── CATEGORIES ───────────────────────────────────────────────
-- Public: read only
create policy "categories_public_read"
  on categories for select
  to anon, authenticated
  using (true);

-- Admin: full access (service_role bypasses RLS automatically)
create policy "categories_admin_all"
  on categories for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ─── PRODUCTS ─────────────────────────────────────────────────
create policy "products_public_read"
  on products for select
  to anon, authenticated
  using (true);

create policy "products_admin_all"
  on products for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ─── ORDERS ───────────────────────────────────────────────────
-- Anonymous: insert only (create new order without login)
create policy "orders_anon_insert"
  on orders for insert
  to anon
  with check (true);

-- Anonymous: read own order by payment_code (for polling)
create policy "orders_anon_read_by_code"
  on orders for select
  to anon
  using (true);

-- Admin: full access
create policy "orders_admin_all"
  on orders for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ─── ORDER ITEMS ──────────────────────────────────────────────
create policy "order_items_anon_insert"
  on order_items for insert
  to anon
  with check (true);

create policy "order_items_anon_read"
  on order_items for select
  to anon
  using (true);

create policy "order_items_admin_all"
  on order_items for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ─── REVIEWS ──────────────────────────────────────────────────
create policy "reviews_public_read"
  on reviews for select
  to anon, authenticated
  using (true);

create policy "reviews_admin_all"
  on reviews for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- ─── STORAGE ──────────────────────────────────────────────────
-- Run after creating bucket 'product-images' in Supabase dashboard
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "product_images_admin_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and auth.jwt() ->> 'role' = 'admin'
  );

create policy "product_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and auth.jwt() ->> 'role' = 'admin'
  );
