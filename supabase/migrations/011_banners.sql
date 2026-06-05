-- Banner management
create table banners (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subtitle    text,
  image_url   text not null,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

alter table banners enable row level security;

create policy "banners_public_read" on banners
  for select to anon, authenticated
  using (true);

create policy "banners_admin_all" on banners
  for all to authenticated
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- NOTE: After running this migration, create a Storage bucket named
-- "banner-images" via Supabase Dashboard > Storage > New bucket
-- Set it as Public. Add storage policies:
--   INSERT: (auth.jwt() ->> 'role' = 'admin')
--   SELECT: true (public read)
