-- Fix coupons_admin_all policy: avoid auth.users join that breaks anon queries
drop policy if exists "coupons_admin_all" on coupons;

create policy "coupons_admin_all" on coupons
  for all
  using (auth.jwt() ->> 'role' = 'admin' or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
