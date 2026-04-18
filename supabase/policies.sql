-- RLS policies for CyberSathi.in — run AFTER `pnpm db:push` creates tables.
-- Copy-paste into Supabase SQL Editor, or apply via `psql $DATABASE_URL -f supabase/policies.sql`.

-- ----------------------------------------------------------------------------
-- Profiles: FK to auth.users + auto-create on signup
-- ----------------------------------------------------------------------------
alter table public.profiles
  add constraint profiles_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin predicate — reused by policies below.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- ----------------------------------------------------------------------------
-- Enable RLS
-- ----------------------------------------------------------------------------
alter table public.blogs             enable row level security;
alter table public.news_articles     enable row level security;
alter table public.videos            enable row level security;
alter table public.categories        enable row level security;
alter table public.tags              enable row level security;
alter table public.blog_tags         enable row level security;
alter table public.news_tags         enable row level security;
alter table public.video_tags        enable row level security;
alter table public.topic_queue       enable row level security;
alter table public.news_sources      enable row level security;
alter table public.job_runs          enable row level security;
alter table public.subscribers       enable row level security;
alter table public.profiles          enable row level security;

-- ----------------------------------------------------------------------------
-- Public read: only `published` rows on content tables.
-- ----------------------------------------------------------------------------
create policy "public read published blogs"
  on public.blogs for select using (status = 'published');

create policy "public read published news"
  on public.news_articles for select using (status = 'published');

create policy "public read published videos"
  on public.videos for select using (status = 'published');

-- Taxonomy + pivot tables: readable by everyone (safe, no PII).
create policy "public read categories" on public.categories for select using (true);
create policy "public read tags"       on public.tags       for select using (true);
create policy "public read blog_tags"  on public.blog_tags  for select using (true);
create policy "public read news_tags"  on public.news_tags  for select using (true);
create policy "public read video_tags" on public.video_tags for select using (true);

-- ----------------------------------------------------------------------------
-- Admin full-access on everything (gated by is_admin()).
-- ----------------------------------------------------------------------------
create policy "admin all blogs"         on public.blogs          for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all news"          on public.news_articles  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all videos"        on public.videos         for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all categories"    on public.categories     for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all tags"          on public.tags           for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all blog_tags"     on public.blog_tags      for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all news_tags"     on public.news_tags      for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all video_tags"    on public.video_tags     for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all topic_queue"   on public.topic_queue    for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all news_sources"  on public.news_sources   for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all job_runs"      on public.job_runs       for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all subscribers"   on public.subscribers    for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- Profiles: users read own row; admins read all.
-- ----------------------------------------------------------------------------
create policy "user read own profile"
  on public.profiles for select using (auth.uid() = user_id or public.is_admin());

create policy "user update own profile"
  on public.profiles for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id and role = (select role from public.profiles where user_id = auth.uid()));

create policy "admin all profiles"
  on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- Newsletter: anyone may INSERT their own email (sign-up). Reads are admin-only.
-- Verification flows run under service_role and bypass RLS.
-- ----------------------------------------------------------------------------
create policy "public newsletter signup"
  on public.subscribers for insert with check (true);

-- NOTE: service_role key bypasses RLS entirely — used by cron endpoints and
-- server-side jobs (blog gen, news scrape, video fetch, newsletter verify).
