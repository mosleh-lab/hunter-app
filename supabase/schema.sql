-- ARISE online: profiles, friends and leaderboards.
-- Run once in Supabase: SQL Editor -> New query -> paste all of this -> Run.
-- Safe to run again (it skips what already exists).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null check (username ~ '^[A-Za-z0-9_.]{3,20}$'),
  country text check (country ~ '^[A-Z]{2}$'),
  level int not null default 1 check (level between 1 and 2000),
  rank text not null default 'E' check (rank in ('E', 'D', 'C', 'B', 'A', 'S', 'N')),
  total_xp int not null default 0 check (total_xp between 0 and 10000000),
  week_xp int not null default 0 check (week_xp between 0 and 20000),
  week_start date,
  streak int not null default 0 check (streak between 0 and 100000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists profiles_username_key on public.profiles (lower(username));
create index if not exists profiles_total_idx on public.profiles (total_xp desc);
create index if not exists profiles_week_idx on public.profiles (week_start, week_xp desc);
create index if not exists profiles_country_idx on public.profiles (country, total_xp desc);

create table if not exists public.friendships (
  requester uuid not null references public.profiles (id) on delete cascade,
  addressee uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  primary key (requester, addressee),
  check (requester <> addressee)
);
create index if not exists friendships_addressee_idx on public.friendships (addressee);

-- Only signed-in users can see anything; everyone edits only their own rows.
alter table public.profiles enable row level security;
alter table public.friendships enable row level security;

drop policy if exists "profiles: signed-in users read" on public.profiles;
create policy "profiles: signed-in users read" on public.profiles for select to authenticated using (true);
drop policy if exists "profiles: create own" on public.profiles;
create policy "profiles: create own" on public.profiles for insert to authenticated with check (id = (select auth.uid()));
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
drop policy if exists "profiles: delete own" on public.profiles;
create policy "profiles: delete own" on public.profiles for delete to authenticated using (id = (select auth.uid()));

drop policy if exists "friends: see own" on public.friendships;
create policy "friends: see own" on public.friendships for select to authenticated using ((select auth.uid()) in (requester, addressee));
drop policy if exists "friends: send request" on public.friendships;
create policy "friends: send request" on public.friendships for insert to authenticated with check (requester = (select auth.uid()) and status = 'pending');
drop policy if exists "friends: accept request" on public.friendships;
create policy "friends: accept request" on public.friendships for update to authenticated using (addressee = (select auth.uid())) with check (addressee = (select auth.uid()) and status = 'accepted');
drop policy if exists "friends: remove" on public.friendships;
create policy "friends: remove" on public.friendships for delete to authenticated using ((select auth.uid()) in (requester, addressee));

revoke all on public.profiles, public.friendships from anon;
grant select, insert, update, delete on public.profiles, public.friendships to authenticated;

-- keep updated_at honest
create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

-- Backups: one private copy of each player's progress (only they can read or write it).
create table if not exists public.backups (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.backups enable row level security;
drop policy if exists "backups: own" on public.backups;
create policy "backups: own" on public.backups for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
revoke all on public.backups from anon;
grant select, insert, update, delete on public.backups to authenticated;
