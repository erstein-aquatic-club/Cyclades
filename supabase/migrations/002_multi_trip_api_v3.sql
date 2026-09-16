-- Multi-trip V3 RPC API.
-- Additive migration: existing V1/V2 RPC contracts remain unchanged.
-- The app still uses its custom session-token authentication during this transition.

-- List only trips the current application user belongs to.
create or replace function public.app_list_my_trips(p_token text)
returns table (
  id uuid,
  name text,
  slug text,
  destination_label text,
  start_date date,
  end_date date,
  timezone text,
  currency text,
  cover_image_url text,
  status text,
  role text,
  member_count bigint
)
language plpgsql security definer set search_path='public','extensions' as $$
declare v_user_id uuid;
begin
  select s.user_id into v_user_id
  from public.app_sessions s
  where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now()
  limit 1;
  if v_user_id is null then raise exception 'Session invalide'; end if;

  return query
  select t.id,t.name,t.slug,t.destination_label,t.start_date,t.end_date,t.timezone,t.currency,
         t.cover_image_url,t.status,tm.role,
         (select count(*) from public.trip_members tm2 where tm2.trip_id=t.id) as member_count
  from public.trips t
  join public.trip_members tm on tm.trip_id=t.id and tm.user_id=v_user_id
  order by t.start_date desc,t.created_at desc;
end;
$$;

-- Get one trip, only if the current user is a member.
create or replace function public.app_get_trip(p_token text,p_trip_id uuid)
returns table (
  id uuid,name text,slug text,destination_label text,start_date date,end_date date,
  timezone text,currency text,cover_image_url text,status text,role text
)
language plpgsql security definer set search_path='public','extensions' as $$
declare v_user_id uuid;
begin
  select s.user_id into v_user_id from public.app_sessions s
  where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now() limit 1;
  if v_user_id is null then raise exception 'Session invalide'; end if;

  return query
  select t.id,t.name,t.slug,t.destination_label,t.start_date,t.end_date,t.timezone,t.currency,
         t.cover_image_url,t.status,tm.role
  from public.trips t
  join public.trip_members tm on tm.trip_id=t.id
  where t.id=p_trip_id and tm.user_id=v_user_id;
end;
$$;

-- List trip members. Membership is checked before returning anything.
create or replace function public.app_list_trip_members(p_token text,p_trip_id uuid)
returns table (member_id uuid,user_id uuid,username text,display_name text,role text,joined_at timestamptz)
language plpgsql security definer set search_path='public','extensions' as $$
declare v_user_id uuid;
begin
  select s.user_id into v_user_id from public.app_sessions s
  where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now() limit 1;
  if v_user_id is null then raise exception 'Session invalide'; end if;
  if not exists(select 1 from public.trip_members tm where tm.trip_id=p_trip_id and tm.user_id=v_user_id) then
    raise exception 'Accès au voyage refusé';
  end if;

  return query
  select tm.id,u.id,u.username,u.display_name,tm.role,tm.joined_at
  from public.trip_members tm
  join public.app_users u on u.id=tm.user_id
  where tm.trip_id=p_trip_id
  order by case tm.role when 'owner' then 1 when 'editor' then 2 else 3 end,u.display_name;
end;
$$;

-- V3 expense listing is scoped to one trip. Legacy expense_people is returned for UI compatibility.
create or replace function public.app_list_trip_expenses_v3(p_token text,p_trip_id uuid)
returns table (
  id uuid,user_id uuid,amount numeric,currency text,category text,description text,
  expense_date date,island text,payment_method text,created_at timestamptz,
  updated_at timestamptz,trip_id uuid,people text[]
)
language plpgsql security definer set search_path='public','extensions' as $$
declare v_user_id uuid;
begin
  select s.user_id into v_user_id from public.app_sessions s
  where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now() limit 1;
  if v_user_id is null then raise exception 'Session invalide'; end if;
  if not exists(select 1 from public.trip_members tm where tm.trip_id=p_trip_id and tm.user_id=v_user_id) then
    raise exception 'Accès au voyage refusé';
  end if;

  return query
  select e.id,e.user_id,e.amount,e.currency,e.category,e.description,e.expense_date,e.island,
         e.payment_method,e.created_at,e.updated_at,e.trip_id,
         coalesce(array_agg(ep.person_name order by ep.person_name) filter (where ep.person_name is not null),array[]::text[]) as people
  from public.expenses e
  left join public.expense_people ep on ep.expense_id=e.id
  where e.trip_id=p_trip_id
  group by e.id
  order by e.expense_date desc,e.created_at desc;
end;
$$;

-- Create a trip expense. Owners/editors may write; viewers are read-only.
-- p_people stays name-based temporarily so the current allocation table can coexist until Phase 5.
create or replace function public.app_add_trip_expense_v3(
  p_token text,p_trip_id uuid,p_amount numeric,p_currency text,p_category text,p_description text,
  p_expense_date date,p_island text,p_payment_method text,p_people text[]
)
returns uuid
language plpgsql security definer set search_path='public','extensions' as $$
declare v_user_id uuid; v_role text; v_expense_id uuid; v_person text;
begin
  select s.user_id into v_user_id from public.app_sessions s
  where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now() limit 1;
  if v_user_id is null then raise exception 'Session invalide'; end if;

  select tm.role into v_role from public.trip_members tm
  where tm.trip_id=p_trip_id and tm.user_id=v_user_id;
  if v_role is null then raise exception 'Accès au voyage refusé'; end if;
  if v_role not in ('owner','editor') then raise exception 'Droits insuffisants'; end if;
  if p_people is null or coalesce(array_length(p_people,1),0)=0 then raise exception 'Affectation requise'; end if;

  -- Every allocation name must resolve to a member of this trip.
  if exists (
    select 1 from unnest(p_people) p(person_name)
    where not exists (
      select 1 from public.trip_members tm
      join public.app_users u on u.id=tm.user_id
      where tm.trip_id=p_trip_id and lower(u.username)=lower(p.person_name)
    )
  ) then raise exception 'Personne invalide pour ce voyage'; end if;

  insert into public.expenses(user_id,trip_id,amount,currency,category,description,expense_date,island,payment_method)
  values(v_user_id,p_trip_id,p_amount,coalesce(p_currency,'EUR'),coalesce(p_category,'Autre'),nullif(p_description,''),p_expense_date,nullif(p_island,''),nullif(p_payment_method,''))
  returning id into v_expense_id;

  foreach v_person in array p_people loop
    insert into public.expense_people(expense_id,person_name)
    select v_expense_id,u.username
    from public.trip_members tm join public.app_users u on u.id=tm.user_id
    where tm.trip_id=p_trip_id and lower(u.username)=lower(v_person)
    on conflict do nothing;
  end loop;
  return v_expense_id;
end;
$$;

create or replace function public.app_set_trip_expense_people_v3(p_token text,p_trip_id uuid,p_expense_id uuid,p_people text[])
returns boolean
language plpgsql security definer set search_path='public','extensions' as $$
declare v_user_id uuid; v_role text; v_person text;
begin
  select s.user_id into v_user_id from public.app_sessions s
  where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now() limit 1;
  if v_user_id is null then raise exception 'Session invalide'; end if;
  select tm.role into v_role from public.trip_members tm where tm.trip_id=p_trip_id and tm.user_id=v_user_id;
  if v_role is null then raise exception 'Accès au voyage refusé'; end if;
  if v_role not in ('owner','editor') then raise exception 'Droits insuffisants'; end if;
  if not exists(select 1 from public.expenses e where e.id=p_expense_id and e.trip_id=p_trip_id) then return false; end if;
  if p_people is null or coalesce(array_length(p_people,1),0)=0 then raise exception 'Affectation requise'; end if;
  if exists (
    select 1 from unnest(p_people) p(person_name)
    where not exists (
      select 1 from public.trip_members tm join public.app_users u on u.id=tm.user_id
      where tm.trip_id=p_trip_id and lower(u.username)=lower(p.person_name)
    )
  ) then raise exception 'Personne invalide pour ce voyage'; end if;

  delete from public.expense_people where expense_id=p_expense_id;
  foreach v_person in array p_people loop
    insert into public.expense_people(expense_id,person_name)
    select v_expense_id,u.username
    from public.trip_members tm join public.app_users u on u.id=tm.user_id
    where tm.trip_id=p_trip_id and lower(u.username)=lower(v_person)
    on conflict do nothing;
  end loop;
  return true;
end;
$$;

-- Delete only an expense belonging to the selected trip and only with write permission.
create or replace function public.app_delete_trip_expense_v3(p_token text,p_trip_id uuid,p_expense_id uuid)
returns boolean
language plpgsql security definer set search_path='public','extensions' as $$
declare v_user_id uuid; v_role text; v_count int;
begin
  select s.user_id into v_user_id from public.app_sessions s
  where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now() limit 1;
  if v_user_id is null then raise exception 'Session invalide'; end if;
  select tm.role into v_role from public.trip_members tm where tm.trip_id=p_trip_id and tm.user_id=v_user_id;
  if v_role is null then raise exception 'Accès au voyage refusé'; end if;
  if v_role not in ('owner','editor') then raise exception 'Droits insuffisants'; end if;

  delete from public.expenses where id=p_expense_id and trip_id=p_trip_id;
  get diagnostics v_count=row_count;
  return v_count>0;
end;
$$;

-- SECURITY DEFINER is required by the current custom-auth architecture because the underlying
-- tables have no anon grants. Expose only the explicit RPC surface and only to anon.
revoke all on function public.app_list_my_trips(text) from public,authenticated;
revoke all on function public.app_get_trip(text,uuid) from public,authenticated;
revoke all on function public.app_list_trip_members(text,uuid) from public,authenticated;
revoke all on function public.app_list_trip_expenses_v3(text,uuid) from public,authenticated;
revoke all on function public.app_add_trip_expense_v3(text,uuid,numeric,text,text,text,date,text,text,text[]) from public,authenticated;
revoke all on function public.app_set_trip_expense_people_v3(text,uuid,uuid,text[]) from public,authenticated;
revoke all on function public.app_delete_trip_expense_v3(text,uuid,uuid) from public,authenticated;

grant execute on function public.app_list_my_trips(text) to anon;
grant execute on function public.app_get_trip(text,uuid) to anon;
grant execute on function public.app_list_trip_members(text,uuid) to anon;
grant execute on function public.app_list_trip_expenses_v3(text,uuid) to anon;
grant execute on function public.app_add_trip_expense_v3(text,uuid,numeric,text,text,text,date,text,text,text[]) to anon;
grant execute on function public.app_set_trip_expense_people_v3(text,uuid,uuid,text[]) to anon;
grant execute on function public.app_delete_trip_expense_v3(text,uuid,uuid) to anon;
