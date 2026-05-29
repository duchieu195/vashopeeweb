-- Coupon system
create table coupons (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,
  discount     integer not null check (discount > 0 and discount <= 100),
  is_active    boolean not null default true,
  created_at   timestamptz default now()
);

-- RLS
alter table coupons enable row level security;

-- Anon/authenticated can read active coupons (needed for checkout validation)
create policy "coupons_public_read" on coupons
  for select using (is_active = true);

-- Admin full access
create policy "coupons_admin_all" on coupons
  for all using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Add coupon fields to orders
alter table orders
  add column coupon_code     text    references coupons(code) on update cascade,
  add column discount_amount integer default 0;
