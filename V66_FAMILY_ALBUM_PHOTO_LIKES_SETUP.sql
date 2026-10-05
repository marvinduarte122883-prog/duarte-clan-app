-- V66 Family Album Photo Likes setup (run once in Supabase SQL Editor)
create table if not exists public.family_album_photo_likes (
  photo_id bigint not null references public.family_album_photos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (photo_id, user_id)
);
alter table public.family_album_photo_likes enable row level security;

drop policy if exists "duarte_members_read_album_photo_likes" on public.family_album_photo_likes;
create policy "duarte_members_read_album_photo_likes" on public.family_album_photo_likes
for select to authenticated using (
  exists (select 1 from public.profiles p where p.id=auth.uid() and p.approved=true)
);

drop policy if exists "duarte_members_like_album_photos" on public.family_album_photo_likes;
create policy "duarte_members_like_album_photos" on public.family_album_photo_likes
for insert to authenticated with check (
  user_id=auth.uid() and exists (select 1 from public.profiles p where p.id=auth.uid() and p.approved=true)
);

drop policy if exists "duarte_members_unlike_album_photos" on public.family_album_photo_likes;
create policy "duarte_members_unlike_album_photos" on public.family_album_photo_likes
for delete to authenticated using (user_id=auth.uid());

grant select, insert, delete on public.family_album_photo_likes to authenticated;
