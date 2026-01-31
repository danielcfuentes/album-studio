-- Album Studio / AlbumHub – Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor) or via Supabase CLI.

-- Enable UUID extension if not already
create extension if not exists "uuid-ossp";

-- =============================================================================
-- ALBUMS
-- =============================================================================
create table public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  cover_image_url text not null,
  external_album_url text not null,
  description text not null default '',
  event_date date not null,
  created_at timestamptz not null default now(),
  location text not null default '',
  tags text[] not null default '{}',
  featured boolean not null default false,
  visibility text not null default 'public' check (visibility in ('public', 'unlisted')),
  view_count integer not null default 0,
  click_count integer not null default 0
);

create index albums_slug_idx on public.albums (slug);
create index albums_visibility_idx on public.albums (visibility);
create index albums_event_date_idx on public.albums (event_date desc);

-- =============================================================================
-- SITE SETTINGS (single row – id = constant)
-- =============================================================================
create table public.site_settings (
  id uuid primary key default '00000000-0000-0000-0000-000000000001',
  photographer_name text not null default 'Photographer',
  tagline text not null default '',
  logo_url text,
  email text,
  phone text,
  location text,
  about_me text,
  about_image_url text,
  social_links jsonb not null default '{}',
  accent_color text not null default 'neutral',
  dark_mode_default boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Ensure only one row: trigger to prevent multiple rows (optional; you can also enforce in app)
create or replace function public.ensure_single_site_settings()
returns trigger as $$
begin
  if (select count(*) from public.site_settings) >= 1 and not exists (select 1 from public.site_settings where id = new.id) then
    raise exception 'Only one site_settings row is allowed. Update the existing row instead.';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger ensure_single_site_settings_trigger
  before insert on public.site_settings
  for each row execute function public.ensure_single_site_settings();

-- Insert default row (single row; use fixed id for easy select/update)
insert into public.site_settings (
  id,
  photographer_name,
  tagline,
  email,
  location,
  about_me,
  social_links,
  accent_color,
  dark_mode_default
) values (
  '00000000-0000-0000-0000-000000000001',
  'Jorge Zenteno',
  'Photographer for @pasorunclub. Capturing the moment.',
  'hello@jorgezenteno.com',
  'New York',
  'With over a decade of experience capturing life''s most precious moments, I''ve had the privilege of documenting hundreds of weddings, family gatherings, and milestone celebrations.

My approach combines candid documentary-style photography with timeless artistic portraits. I believe the best images come from genuine connections and authentic moments – not forced poses.

When I''m not behind the camera, you''ll find me exploring new trails or spending time with family and friends.',
  '{"instagram": "https://www.instagram.com/jorge.photog/"}'::jsonb,
  'neutral',
  false
)
on conflict (id) do nothing;

-- =============================================================================
-- CONTACT SUBMISSIONS
-- =============================================================================
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index contact_submissions_created_at_idx on public.contact_submissions (created_at desc);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
alter table public.albums enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_submissions enable row level security;

-- Albums: anyone can read public albums; authenticated users can do everything
create policy "Public albums are viewable by everyone"
  on public.albums for select
  using (visibility = 'public');

create policy "Authenticated users can manage albums"
  on public.albums for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Site settings: anyone can read; only authenticated can update
create policy "Site settings are viewable by everyone"
  on public.site_settings for select
  using (true);

create policy "Authenticated users can update site settings"
  on public.site_settings for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Allow insert of first site_settings row"
  on public.site_settings for insert
  with check (auth.role() = 'authenticated' or (select count(*) from public.site_settings) = 0);

-- Contact submissions: anyone can insert; only authenticated can read
create policy "Anyone can submit contact form"
  on public.contact_submissions for insert
  with check (true);

create policy "Authenticated users can read contact submissions"
  on public.contact_submissions for select
  using (auth.role() = 'authenticated');

-- =============================================================================
-- RPC: increment view/click count (callable by anon so public pages can track)
-- =============================================================================
create or replace function public.increment_album_view_count(album_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.albums set view_count = view_count + 1 where id = album_id;
$$;

create or replace function public.increment_album_click_count(album_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.albums set click_count = click_count + 1 where id = album_id;
$$;

-- =============================================================================
-- HELPER: updated_at for site_settings
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();
