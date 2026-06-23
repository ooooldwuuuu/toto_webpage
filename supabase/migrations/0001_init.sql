-- TOTO storefront — initial schema
-- Run in Supabase: SQL Editor → paste → Run, or `supabase db push` with the CLI.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text,
  category_id  uuid references public.categories (id) on delete set null,
  brand        text not null default 'TOTO',
  model_number text,
  sku          text,
  price        numeric(12, 2),
  -- Storage object paths inside the `product-images` bucket.
  images       text[] not null default '{}',
  -- Free-form spec sheet: { "尺寸": "...", "材質": "..." }
  specs        jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  is_new       boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_published_idx on public.products (is_published);

-- Keep updated_at fresh on every change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Model: the storefront is public read-only; any *authenticated* user is an
-- admin (accounts are created manually in the Supabase dashboard, so a login
-- == back-office staff). Tighten later with a roles table if needed.
-- ---------------------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Categories: world-readable, admin-writable.
drop policy if exists "categories are public" on public.categories;
create policy "categories are public"
  on public.categories for select
  using (true);

drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

-- Products: published rows are public; admins see and write everything.
drop policy if exists "published products are public" on public.products;
create policy "published products are public"
  on public.products for select
  using (is_published = true);

drop policy if exists "products admin read" on public.products;
create policy "products admin read"
  on public.products for select
  to authenticated
  using (true);

drop policy if exists "products admin write" on public.products;
create policy "products admin write"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for product images (public read, admin write)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product images are public" on storage.objects;
create policy "product images are public"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "product images admin write" on storage.objects;
create policy "product images admin write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');
