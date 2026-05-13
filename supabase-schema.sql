-- ============================================
-- Scribe Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Documents table
create table documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled',
  content jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Knowledge items table
create table knowledge (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references documents(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now()
);

-- Auto-update updated_at on documents
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger documents_updated_at
  before update on documents
  for each row
  execute function update_updated_at();

-- Enable Row Level Security
alter table documents enable row level security;
alter table knowledge enable row level security;

-- Documents RLS policies
create policy "Users can view their own documents"
  on documents for select
  using (auth.uid() = user_id);

create policy "Users can create their own documents"
  on documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own documents"
  on documents for update
  using (auth.uid() = user_id);

create policy "Users can delete their own documents"
  on documents for delete
  using (auth.uid() = user_id);

-- Knowledge RLS policies
create policy "Users can view their own knowledge"
  on knowledge for select
  using (auth.uid() = user_id);

create policy "Users can create their own knowledge"
  on knowledge for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own knowledge"
  on knowledge for update
  using (auth.uid() = user_id);

create policy "Users can delete their own knowledge"
  on knowledge for delete
  using (auth.uid() = user_id);

-- ============================================
-- Profiles (billing / trial) — Phase 2
-- If your project already ran the script above, run
-- only this section in the Supabase SQL Editor.
-- ============================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  trial_ends_at timestamptz not null,
  subscription_status text not null default 'trialing'
    check (subscription_status in ('trialing', 'active', 'past_due', 'canceled')),
  paystack_customer_code text,
  paystack_subscription_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, trial_ends_at, subscription_status)
  values (new.id, now() + interval '3 days', 'trialing');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

grant select on table public.profiles to authenticated;

-- Optional: backfill profiles for users created before this migration.
-- Assigns a fresh 3-day trial from migration time. Adjust interval if needed.
-- insert into public.profiles (id, trial_ends_at, subscription_status)
-- select u.id, now() + interval '3 days', 'trialing'
-- from auth.users u
-- where not exists (select 1 from public.profiles p where p.id = u.id);
