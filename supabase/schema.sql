create extension if not exists pgcrypto;

create table if not exists public.bet_journal (
  id uuid primary key default gen_random_uuid(),
  match_id text not null,
  match_name text not null,
  bet_type text not null,
  odds numeric(10, 3) not null check (odds >= 1),
  stake numeric(12, 2) not null check (stake >= 0),
  prediction_confidence integer not null check (prediction_confidence between 1 and 100),
  result text not null check (result in ('pending', 'win', 'loss', 'push', 'void')),
  profit_loss numeric(12, 2) not null default 0,
  notes text not null default '',
  team text,
  created_at timestamptz not null default now()
);

drop policy if exists "bet_journal_select_own" on public.bet_journal;
drop policy if exists "bet_journal_insert_own" on public.bet_journal;
drop policy if exists "bet_journal_update_own" on public.bet_journal;
drop policy if exists "bet_journal_delete_own" on public.bet_journal;

drop index if exists bet_journal_user_created_idx;
drop index if exists bet_journal_user_team_idx;

alter table public.bet_journal drop constraint if exists bet_journal_user_id_fkey;
alter table public.bet_journal drop column if exists user_id;

alter table public.bet_journal disable row level security;

create index if not exists bet_journal_created_idx
on public.bet_journal (created_at desc);

create index if not exists bet_journal_team_idx
on public.bet_journal (team)
where team is not null;
