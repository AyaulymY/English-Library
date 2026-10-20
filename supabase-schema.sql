-- English Library content database
-- IMPORTANT: replace YOUR_ADMIN_EMAIL@example.com with the teacher's login email.
-- Run in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  grade integer not null check (grade between 3 and 11),
  kind text not null check (kind in ('grammar', 'task', 'game')),
  title text not null,
  content text not null,
  explanation_kk text not null default '',
  options jsonb not null default '[]'::jsonb,
  answer text not null default '',
  game_type text not null default 'quiz',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_items_grade_kind_idx
  on public.content_items (grade, kind, is_published);

alter table public.content_items enable row level security;

drop policy if exists "Anyone can read published content" on public.content_items;
create policy "Anyone can read published content"
  on public.content_items for select
  using (is_published = true);

drop policy if exists "Teacher can read all content" on public.content_items;
create policy "Teacher can read all content"
  on public.content_items for select to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com');

drop policy if exists "Teacher can insert content" on public.content_items;
create policy "Teacher can insert content"
  on public.content_items for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com');

drop policy if exists "Teacher can update content" on public.content_items;
create policy "Teacher can update content"
  on public.content_items for update to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com')
  with check ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com');

drop policy if exists "Teacher can delete content" on public.content_items;
create policy "Teacher can delete content"
  on public.content_items for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com');

grant select on public.content_items to anon, authenticated;
grant insert, update, delete on public.content_items to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_items_set_updated_at on public.content_items;
create trigger content_items_set_updated_at
before update on public.content_items
for each row execute function public.set_updated_at();
