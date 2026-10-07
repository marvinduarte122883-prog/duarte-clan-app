-- V91 recipient-side group call invitation access.
-- Run in Supabase SQL Editor if the receiving account still cannot see its own invited row.

alter table public.duarte_group_call_participants enable row level security;

drop policy if exists "duarte_group_call_participants_read_own" on public.duarte_group_call_participants;
create policy "duarte_group_call_participants_read_own"
on public.duarte_group_call_participants
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "duarte_group_call_participants_update_own" on public.duarte_group_call_participants;
create policy "duarte_group_call_participants_update_own"
on public.duarte_group_call_participants
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

grant select, update on public.duarte_group_call_participants to authenticated;

-- Recipients also need to read the call record referenced by their invitation.
alter table public.duarte_group_calls enable row level security;

drop policy if exists "duarte_group_calls_read_invited" on public.duarte_group_calls;
create policy "duarte_group_calls_read_invited"
on public.duarte_group_calls
for select to authenticated
using (
  host_id = auth.uid()
  or exists (
    select 1
    from public.duarte_group_call_participants p
    where p.call_id = duarte_group_calls.id
      and p.user_id = auth.uid()
  )
);

grant select on public.duarte_group_calls to authenticated;
