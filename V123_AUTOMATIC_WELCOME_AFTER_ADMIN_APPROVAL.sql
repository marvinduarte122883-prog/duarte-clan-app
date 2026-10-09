-- Duarte Clan V123: send a one-time welcome BELL notification after admin approval.
-- Execute once in Supabase SQL Editor as the project owner.
-- Admin approval remains required. This does not auto-approve registrations.

create table if not exists public.duarte_welcome_deliveries (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  delivered_at timestamptz not null default now()
);

-- Only server-side trigger may record a delivery.
revoke all on table public.duarte_welcome_deliveries from anon, authenticated;
alter table public.duarte_welcome_deliveries enable row level security;

create or replace function public.duarte_send_welcome_after_approval()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name text;
  v_message text;
begin
  -- Only the first transition from not-approved to approved counts.
  if old.approved is distinct from true and new.approved is true
     and lower(coalesce(new.clan_role,'')) <> 'rejected' then
    -- Reserve one delivery per member, including future re-approvals.
    insert into public.duarte_welcome_deliveries (user_id)
      values (new.id)
      on conflict (user_id) do nothing;

    if found then
      v_name := coalesce(nullif(btrim(new.full_name), ''), 'Clan Member');
      v_message := '🎉 Welcome to the Duarte Clan Family, ' || v_name ||
        '! Your membership has been approved. Explore family stories, share memories and photos, join clan events, and connect with the family. ❤️ — Duarte Clan Administration';

      insert into public.notifications (user_id, type, message, is_read)
      values (new.id, 'welcome', v_message, false);
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.duarte_send_welcome_after_approval() from public;

drop trigger if exists trg_duarte_welcome_after_admin_approval on public.profiles;
create trigger trg_duarte_welcome_after_admin_approval
  after update of approved on public.profiles
  for each row
  when (old.approved is distinct from true and new.approved is true)
  execute function public.duarte_send_welcome_after_approval();

-- No backfill: previously approved members will not receive old welcomes.
-- If notifications.type has a CHECK constraint disallowing 'welcome',
-- the SQL must be adapted to that constraint before approving new members.
