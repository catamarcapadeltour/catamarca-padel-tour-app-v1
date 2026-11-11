-- Esquema inicial de referencia para Supabase/PostgreSQL.
-- Revisar y aplicar junto con políticas RLS antes de publicar datos reales.

create extension if not exists pgcrypto;

create type public.member_role as enum ('player', 'organizer');
create type public.tournament_status as enum ('draft', 'registration', 'in_progress', 'finished');
create type public.registration_status as enum ('pending', 'approved', 'rejected');
create type public.match_status as enum ('scheduled', 'played', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  city text default 'Catamarca',
  avatar_url text,
  role public.member_role not null default 'player',
  created_at timestamptz not null default now()
);

create table public.tournaments (
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

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name text not null,
  division text,
  unique (tournament_id, name)
);

create table public.pairs (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  player_one_id uuid not null references public.profiles(id),
  player_two_id uuid not null references public.profiles(id),
  status public.registration_status not null default 'pending',
  created_at timestamptz not null default now(),
  check (player_one_id <> player_two_id),
  unique (category_id, player_one_id, player_two_id)
);

create table public.zones (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  unique (category_id, name)
);

create table public.zone_pairs (
  zone_id uuid not null references public.zones(id) on delete cascade,
  pair_id uuid not null references public.pairs(id) on delete cascade,
  primary key (zone_id, pair_id),
  unique (pair_id)
);

create table public.matches (
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

create table public.match_sets (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  set_number smallint not null check (set_number between 1 and 5),
  pair_one_games smallint not null check (pair_one_games >= 0),
  pair_two_games smallint not null check (pair_two_games >= 0),
  unique (match_id, set_number)
);

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  display_order integer not null default 0,
  is_active boolean not null default true
);

create index pairs_category_status_idx on public.pairs(category_id, status);
create index matches_category_schedule_idx on public.matches(category_id, scheduled_at);

-- Antes de habilitar datos reales: activar RLS en cada tabla y crear políticas
-- que permitan a cada jugador ver/editar su propio perfil y solo a organizadores
-- autorizados administrar torneos, inscripciones y resultados.
