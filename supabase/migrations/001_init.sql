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

-- Row Level Security (RLS) policies
-- Enable RLS and create policies that:
--  - allow authenticated users to insert and manage their own profile
--  - allow public selects for profiles marked is_public=true
--  - allow owners to manage their profile_links
--  - allow insertion of page_views from anywhere, and allow owners to select their page views

-- Profiles: enable RLS and policies
alter table profiles enable row level security;

create policy "Insert only as owner" on profiles
  for insert
  with check (auth.uid() IS NOT NULL AND user_id = auth.uid());

create policy "Update/Delete by owner" on profiles
  for update, delete
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Public select or owner" on profiles
  for select
  using (is_public = true OR user_id = auth.uid());

-- Profile links: enable RLS and policies
alter table profile_links enable row level security;

create policy "Manage own links" on profile_links
  for insert, update, delete
  using (
    exists (
      select 1 from profiles p where p.id = profile_links.profile_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from profiles p where p.id = profile_links.profile_id and p.user_id = auth.uid()
    )
  );

create policy "Select public links" on profile_links
  for select
  using (
    exists (
      select 1 from profiles p where p.id = profile_links.profile_id and p.is_public = true
    )
  );

-- Page views: enable RLS and policies
alter table page_views enable row level security;

-- Allow anyone (including anon clients or server-side functions) to insert page views
create policy "Insert page views" on page_views
  for insert
  with check (true);

-- Allow profile owner to select their page views
create policy "Select page views for owner" on page_views
  for select
  using (
    exists (
      select 1 from profiles p where p.id = page_views.profile_id and p.user_id = auth.uid()
    )
  );
