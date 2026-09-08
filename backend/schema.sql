-- Run this in the Supabase SQL editor for your project.
-- Free tier covers this comfortably at "thousands of users" scale.

create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_calorie_limit integer not null default 2000,
  water_reminder_interval_minutes integer not null default 120,
  created_at timestamptz not null default now()
);

create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  total_calories integer not null default 0,
  confirmed boolean not null default false
);

-- One row per photo; a meal can have several (main plate, side, dessert...)
create table if not exists meal_photos (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references meals(id) on delete cascade,
  storage_path text not null, -- path in Supabase Storage, not the raw image
  plate_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- One row per confirmed food item within a meal
create table if not exists meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references meals(id) on delete cascade,
  name text not null,
  estimated_grams numeric not null,
  calories_per_100g numeric not null,
  source text not null check (source in ('usda', 'openfoodfacts', 'manual'))
);

-- Packaged-food scans logged via barcode, separate from photo-based meals
create table if not exists packaged_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  barcode text not null,
  product_name text,
  calories_per_100g numeric,
  nutri_score text,
  nova_group integer,
  logged_at timestamptz not null default now()
);

-- Row Level Security: every user only sees their own data.
alter table user_settings enable row level security;
alter table meals enable row level security;
alter table meal_photos enable row level security;
alter table meal_items enable row level security;
alter table packaged_scans enable row level security;

create policy "own settings" on user_settings for all using (auth.uid() = user_id);
create policy "own meals" on meals for all using (auth.uid() = user_id);
create policy "own scans" on packaged_scans for all using (auth.uid() = user_id);
create policy "own meal photos" on meal_photos for all using (
  auth.uid() = (select user_id from meals where meals.id = meal_photos.meal_id)
);
create policy "own meal items" on meal_items for all using (
  auth.uid() = (select user_id from meals where meals.id = meal_items.meal_id)
);
