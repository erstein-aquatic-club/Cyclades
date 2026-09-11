-- Shared Cyclades expense pool and per-person allocation.
-- Apply only to the dedicated Cyclades Supabase project.

create table if not exists public.expense_people (
  expense_id uuid not null references public.expenses(id) on delete cascade,
  person_name text not null check (person_name in ('Francois','Onja')),
  created_at timestamptz not null default now(),
  primary key (expense_id, person_name)
);
alter table public.expense_people enable row level security;
revoke all on public.expense_people from anon, authenticated;
create index if not exists expense_people_person_idx on public.expense_people(person_name, expense_id);

create or replace function public.app_list_expenses_v2(p_token text)
returns table (
  id uuid,user_id uuid,amount numeric,currency text,category text,description text,
  expense_date date,island text,payment_method text,created_at timestamptz,
  updated_at timestamptz,people text[]
)
language plpgsql security definer set search_path='public','extensions' as $$
declare v_user_id uuid;
begin
  select s.user_id into v_user_id from public.app_sessions s
  where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now();
  if v_user_id is null then raise exception 'Session invalide'; end if;
  return query
  select e.id,e.user_id,e.amount,e.currency,e.category,e.description,e.expense_date,e.island,e.payment_method,e.created_at,e.updated_at,
         coalesce(array_agg(ep.person_name order by ep.person_name) filter (where ep.person_name is not null), array[]::text[]) as people
  from public.expenses e
  left join public.expense_people ep on ep.expense_id=e.id
  group by e.id
  order by e.expense_date desc,e.created_at desc;
end;
$$;

create or replace function public.app_add_expense_v2(
  p_token text,p_amount numeric,p_currency text,p_category text,p_description text,
  p_expense_date date,p_island text,p_payment_method text,p_people text[]
)
returns uuid
language plpgsql security definer set search_path='public','extensions' as $$
declare v_user_id uuid; v_expense_id uuid; v_person text;
begin
  select s.user_id into v_user_id from public.app_sessions s
  where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now();
  if v_user_id is null then raise exception 'Session invalide'; end if;
  if p_people is null or coalesce(array_length(p_people,1),0)=0 then raise exception 'Affectation requise'; end if;
  if exists (select 1 from unnest(p_people) p where p not in ('Francois','Onja')) then raise exception 'Personne invalide'; end if;
  insert into public.expenses(user_id,amount,currency,category,description,expense_date,island,payment_method)
  values(v_user_id,p_amount,coalesce(p_currency,'EUR'),coalesce(p_category,'Autre'),nullif(p_description,''),p_expense_date,nullif(p_island,''),nullif(p_payment_method,''))
  returning id into v_expense_id;
  foreach v_person in array p_people loop
    insert into public.expense_people(expense_id,person_name) values(v_expense_id,v_person) on conflict do nothing;
  end loop;
  return v_expense_id;
end;
$$;

create or replace function public.app_set_expense_people(p_token text,p_expense_id uuid,p_people text[])
returns boolean
language plpgsql security definer set search_path='public','extensions' as $$
declare v_user_id uuid; v_person text;
begin
  select s.user_id into v_user_id from public.app_sessions s
  where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now();
  if v_user_id is null then raise exception 'Session invalide'; end if;
  if not exists(select 1 from public.expenses where id=p_expense_id) then return false; end if;
  if p_people is null or coalesce(array_length(p_people,1),0)=0 then raise exception 'Affectation requise'; end if;
  if exists (select 1 from unnest(p_people) p where p not in ('Francois','Onja')) then raise exception 'Personne invalide'; end if;
  delete from public.expense_people where expense_id=p_expense_id;
  foreach v_person in array p_people loop
    insert into public.expense_people(expense_id,person_name) values(p_expense_id,v_person) on conflict do nothing;
  end loop;
  return true;
end;
$$;

create or replace function public.app_delete_expense(p_token text,p_expense_id uuid)
returns boolean
language plpgsql security definer set search_path='public','extensions' as $$
declare v_user_id uuid; v_count int;
begin
  select s.user_id into v_user_id from public.app_sessions s
  where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now();
  if v_user_id is null then raise exception 'Session invalide'; end if;
  delete from public.expenses where id=p_expense_id;
  get diagnostics v_count = row_count;
  return v_count>0;
end;
$$;

revoke all on function public.app_list_expenses_v2(text) from public, authenticated;
revoke all on function public.app_add_expense_v2(text,numeric,text,text,text,date,text,text,text[]) from public, authenticated;
revoke all on function public.app_set_expense_people(text,uuid,text[]) from public, authenticated;
grant execute on function public.app_list_expenses_v2(text) to anon;
grant execute on function public.app_add_expense_v2(text,numeric,text,text,text,date,text,text,text[]) to anon;
grant execute on function public.app_set_expense_people(text,uuid,text[]) to anon;
