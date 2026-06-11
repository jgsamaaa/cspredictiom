create extension if not exists pgcrypto;

create table if not exists public.bet_journal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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

alter table public.bet_journal enable row level security;

create policy "bet_journal_select_own"
on public.bet_journal for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "bet_journal_insert_own"
on public.bet_journal for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "bet_journal_update_own"
on public.bet_journal for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "bet_journal_delete_own"
on public.bet_journal for delete
to authenticated
using ((select auth.uid()) = user_id);

create index if not exists bet_journal_user_created_idx
on public.bet_journal (user_id, created_at desc);

create index if not exists bet_journal_user_team_idx
on public.bet_journal (user_id, team)
where team is not null;
