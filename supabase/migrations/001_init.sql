-- Run this SQL in your Supabase SQL editor to create the basic schema
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  username text not null unique,
  display_name text,
  bio text,
  profile_image_url text,
  featured_video_url text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists profile_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  title text not null,
  url text not null,
  order_index int default 0
);

create table if not exists page_views (
  id bigserial primary key,
  profile_id uuid references profiles(id) on delete cascade,
  referrer text,
  user_agent text,
  created_at timestamptz default now()
);
