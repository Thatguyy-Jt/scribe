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
