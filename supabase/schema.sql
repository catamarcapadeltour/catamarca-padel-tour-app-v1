-- Esquema inicial seguro para Supabase/PostgreSQL.
-- Ejecutar en SQL Editor. El rol organizer se asigna manualmente desde SQL confiable;
-- nunca se acepta el rol desde metadata de registro del usuario.

create extension if not exists pgcrypto;

do $$ begin
  create type public.member_role as enum ('player', 'organizer');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.tournament_status as enum ('draft', 'registration', 'in_progress', 'finished');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.registration_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.match_status as enum ('scheduled', 'played', 'cancelled');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  city text not null default 'Catamarca',
  avatar_url text,
  role public.member_role not null default 'player',
  created_at timestamptz not null default now()
);

create or replace function public.create_player_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Jugador'), 'player')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users
for each row execute procedure public.create_player_profile();

-- Impide que un usuario autenticado se eleve a organizer editando su propio perfil.
create or replace function public.prevent_self_role_change()
returns trigger language plpgsql set search_path = '' as $$
begin
  if auth.uid() is not null and new.role is distinct from old.role then
    raise exception 'El rol solo puede cambiarlo un administrador de confianza';
  end if;
  return new;
end;
$$;
drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role before update on public.profiles
for each row execute procedure public.prevent_self_role_change();

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  season integer not null,
  description text,
  status public.tournament_status not null default 'draft',
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  starts_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name text not null,
  division text,
  unique (tournament_id, name)
);
create table if not exists public.pairs (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  player_one_id uuid not null references public.profiles(id),
  player_two_id uuid not null references public.profiles(id),
  status public.registration_status not null default 'pending',
  created_at timestamptz not null default now(),
  check (player_one_id <> player_two_id),
  unique (category_id, player_one_id, player_two_id)
);
create table if not exists public.zones (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  unique (category_id, name)
);
create table if not exists public.zone_pairs (
  zone_id uuid not null references public.zones(id) on delete cascade,
  pair_id uuid not null references public.pairs(id) on delete cascade,
  primary key (zone_id, pair_id),
  unique (pair_id)
);
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  zone_id uuid references public.zones(id) on delete set null,
  pair_one_id uuid not null references public.pairs(id),
  pair_two_id uuid not null references public.pairs(id),
  scheduled_at timestamptz,
  court text,
  status public.match_status not null default 'scheduled',
  created_at timestamptz not null default now(),
  check (pair_one_id <> pair_two_id)
);
create table if not exists public.match_sets (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  set_number smallint not null check (set_number between 1 and 5),
  pair_one_games smallint not null check (pair_one_games >= 0),
  pair_two_games smallint not null check (pair_two_games >= 0),
  unique (match_id, set_number)
);
create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  display_order integer not null default 0,
  is_active boolean not null default true
);

create index if not exists pairs_category_status_idx on public.pairs(category_id, status);
create index if not exists matches_category_schedule_idx on public.matches(category_id, scheduled_at);

-- Denegar por defecto y activar RLS en todas las tablas.
alter table public.profiles enable row level security;
alter table public.tournaments enable row level security;
alter table public.categories enable row level security;
alter table public.pairs enable row level security;
alter table public.zones enable row level security;
alter table public.zone_pairs enable row level security;
alter table public.matches enable row level security;
alter table public.match_sets enable row level security;
alter table public.sponsors enable row level security;

drop policy if exists "Profile owner reads profile" on public.profiles;
create policy "Profile owner reads profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
drop policy if exists "Profile owner updates profile" on public.profiles;
create policy "Profile owner updates profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
drop policy if exists "Players read public tournaments" on public.tournaments;
create policy "Players read public tournaments" on public.tournaments for select to anon, authenticated using (status <> 'draft');
drop policy if exists "Players read public categories" on public.categories;
create policy "Players read public categories" on public.categories for select to anon, authenticated using (exists (select 1 from public.tournaments t where t.id = tournament_id and t.status <> 'draft'));
drop policy if exists "Players read approved or own pairs" on public.pairs;
create policy "Players read approved or own pairs" on public.pairs for select to anon, authenticated using (status = 'approved' or player_one_id = (select auth.uid()) or player_two_id = (select auth.uid()));
drop policy if exists "Players create own pair registration" on public.pairs;
create policy "Players create own pair registration" on public.pairs for insert to authenticated with check (player_one_id = (select auth.uid()) and player_two_id <> (select auth.uid()) and status = 'pending');
drop policy if exists "Players read zones for public categories" on public.zones;
create policy "Players read zones for public categories" on public.zones for select to anon, authenticated using (exists (select 1 from public.categories c join public.tournaments t on t.id = c.tournament_id where c.id = category_id and t.status <> 'draft'));
drop policy if exists "Public reads approved zone pairs" on public.zone_pairs;
create policy "Public reads approved zone pairs" on public.zone_pairs for select to anon, authenticated using (exists (select 1 from public.pairs p where p.id = pair_id and p.status = 'approved'));
drop policy if exists "Players read scheduled and played matches" on public.matches;
create policy "Players read scheduled and played matches" on public.matches for select to anon, authenticated using (status in ('scheduled', 'played'));
drop policy if exists "Players read sets for played matches" on public.match_sets;
create policy "Players read sets for played matches" on public.match_sets for select to anon, authenticated using (exists (select 1 from public.matches m where m.id = match_id and m.status = 'played'));
drop policy if exists "Public reads active sponsors" on public.sponsors;
create policy "Public reads active sponsors" on public.sponsors for select to anon, authenticated using (is_active);

-- Asignar organizadores manualmente después de registrar sus cuentas:
-- update public.profiles set role = 'organizer' where id = '<uuid de la cuenta autorizada>';
-- Agregar políticas de escritura limitadas a organizers antes de habilitar el panel administrativo.
