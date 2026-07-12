-- Project Atlas schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)

create extension if not exists "uuid-ossp";

-- Profiles mirror auth.users, extended with billing/plan info
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  plan text not null default 'free', -- 'free' | 'pro'
  credits int not null default 5,     -- edits remaining this period
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

-- One row per uploaded source image
create table if not exists public.images (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,       -- path in the 'atlas-images' bucket
  width int,
  height int,
  original_name text,
  created_at timestamptz not null default now()
);

-- One row per AI edit performed on an image
create table if not exists public.edits (
  id uuid primary key default uuid_generate_v4(),
  image_id uuid not null references public.images(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  marker_x numeric not null,        -- normalized 0-1 x position
  marker_y numeric not null,        -- normalized 0-1 y position
  instruction text not null,
  result_storage_path text,         -- path of edited image once complete
  status text not null default 'pending', -- pending | processing | complete | failed
  error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.images enable row level security;
alter table public.edits enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can CRUD own images" on public.images
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can CRUD own edits" on public.edits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage buckets (create via dashboard or here if using supabase-js admin)
-- insert into storage.buckets (id, name, public) values ('atlas-images', 'atlas-images', true);
