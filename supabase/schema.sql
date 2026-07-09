create type report_type as enum ('danger', 'pollution', 'obstacle', 'wildlife', 'beacon', 'other');
create type report_status as enum ('active', 'confirmed', 'resolved');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  home_port text,
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  type report_type not null,
  status report_status not null default 'active',
  title text not null,
  description text,
  latitude double precision not null,
  longitude double precision not null,
  photo_url text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (report_id, author_id)
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  report_id uuid references public.reports(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, report_id)
);

alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.comments enable row level security;
alter table public.votes enable row level security;
alter table public.favorites enable row level security;

create policy "Reports are readable by everyone"
on public.reports for select
using (true);

create policy "Authenticated users can create reports"
on public.reports for insert
to authenticated
with check (auth.uid() = author_id);

create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id);

