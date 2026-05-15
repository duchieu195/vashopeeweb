-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Categories
create table categories (
  id         text primary key,
  name       text not null,
  icon       text not null,
  slug       text not null unique,
  created_at timestamptz default now()
);

-- Products
create table products (
  id               text primary key,
  category_id      text references categories(id) on delete set null,
  name             text not null,
  brand            text not null,
  price            integer not null,
  original_price   integer,
  images           text[] not null default '{}',
  rating           numeric(3,1) not null default 0,
  review_count     integer not null default 0,
  sold_count       integer not null default 0,
  description      text not null default '',
  ingredients      text,
  is_new           boolean not null default false,
  is_best_seller   boolean not null default false,
  stock_quantity   integer not null default 0,
  created_at       timestamptz default now()
);

create index products_category_id_idx on products(category_id);
create index products_is_best_seller_idx on products(is_best_seller);
create index products_is_new_idx on products(is_new);

-- Orders
create type order_status as enum (
  'pending', 'paid', 'confirmed', 'shipping', 'delivered', 'cancelled'
);

create table orders (
  id               uuid primary key default uuid_generate_v4(),
  payment_code     text not null unique,
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text not null,
  shipping_address text not null,
  notes            text,
  total_amount     integer not null,
  status           order_status not null default 'pending',
  created_at       timestamptz default now()
);

create index orders_status_idx on orders(status);
create index orders_payment_code_idx on orders(payment_code);
create index orders_created_at_idx on orders(created_at desc);

-- Order Items
create table order_items (
  id                 uuid primary key default uuid_generate_v4(),
  order_id           uuid not null references orders(id) on delete cascade,
  product_id         text references products(id) on delete set null,
  product_name       text not null,
  product_image      text,
  quantity           integer not null,
  price_at_purchase  integer not null
);

create index order_items_order_id_idx on order_items(order_id);

-- Reviews
create table reviews (
  id          uuid primary key default uuid_generate_v4(),
  product_id  text references products(id) on delete cascade,
  author      text not null,
  rating      integer not null check (rating between 1 and 5),
  comment     text not null,
  created_at  timestamptz default now()
);

create index reviews_product_id_idx on reviews(product_id);
