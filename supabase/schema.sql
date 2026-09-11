-- Cyclades dedicated Supabase schema. Apply only to the dedicated Cyclades project.
-- Lightweight app login: two private app accounts, salted SHA-256 password hashes,
-- random 90-day session tokens (stored hashed), and RPC-only expense access.
create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_salt text not null,
  password_hash text not null,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days')
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.app_users(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  currency text not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  category text not null default 'Autre',
  description text,
  expense_date date not null default current_date,
  island text,
  payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists expenses_user_date_idx on public.expenses(user_id,expense_date desc,created_at desc);

alter table public.app_users enable row level security;
alter table public.app_sessions enable row level security;
alter table public.expenses enable row level security;
revoke all on public.app_users from anon,authenticated;
revoke all on public.app_sessions from anon,authenticated;
revoke all on public.expenses from anon,authenticated;

-- Initial accounts. Passwords are respectively Francois and Onja; only salted hashes are stored.
insert into public.app_users(username,password_salt,password_hash,display_name) values
('Francois','a6b6772f630e9f6ba5a03b6c4e964809','e56bc2d488f518a5f8913bbfbddafcd080b6240fce7f1edaf208f36dd94a7a19','Francois'),
('Onja','ce826561213a9d1557fd77c9bb6b5849','897b9d3038c8b8264e1b5c2bd513c06709e6a8dc59c22ffcc4377ba595d9f2ec','Onja')
on conflict(username) do nothing;

-- RPC functions are intentionally SECURITY DEFINER because app_users/app_sessions/expenses
-- have no direct anon grants. Every protected RPC validates the random session token first.
create or replace function public.app_login(p_username text,p_password text)
returns table(session_token text,user_id uuid,username text,display_name text,expires_at timestamptz)
language plpgsql security definer set search_path=public,extensions as $$
declare v_user public.app_users%rowtype; v_token text; v_expires timestamptz:=now()+interval '90 days';
begin
 select * into v_user from public.app_users u where lower(u.username)=lower(trim(p_username)) and u.password_hash=encode(digest(decode(u.password_salt,'hex')||convert_to(p_password,'UTF8'),'sha256'),'hex');
 if v_user.id is null then raise exception 'Identifiant ou mot de passe incorrect'; end if;
 delete from public.app_sessions where expires_at<now();
 v_token:=encode(gen_random_bytes(32),'hex');
 insert into public.app_sessions(user_id,token_hash,expires_at) values(v_user.id,encode(digest(v_token,'sha256'),'hex'),v_expires);
 return query select v_token,v_user.id,v_user.username,v_user.display_name,v_expires;
end $$;

create or replace function public.app_session(p_token text)
returns table(user_id uuid,username text,display_name text,expires_at timestamptz)
language sql security definer set search_path=public,extensions as $$
 select u.id,u.username,u.display_name,s.expires_at from public.app_sessions s join public.app_users u on u.id=s.user_id where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now() limit 1;
$$;

create or replace function public.app_logout(p_token text) returns void
language sql security definer set search_path=public,extensions as $$
 delete from public.app_sessions where token_hash=encode(digest(p_token,'sha256'),'hex');
$$;

create or replace function public.app_change_password(p_token text,p_new_password text) returns boolean
language plpgsql security definer set search_path=public,extensions as $$
declare v_user_id uuid; v_salt text;
begin
 if length(coalesce(p_new_password,''))<4 then raise exception 'Le mot de passe doit contenir au moins 4 caractères'; end if;
 select s.user_id into v_user_id from public.app_sessions s where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now();
 if v_user_id is null then raise exception 'Session invalide'; end if;
 v_salt:=encode(gen_random_bytes(16),'hex');
 update public.app_users set password_salt=v_salt,password_hash=encode(digest(decode(v_salt,'hex')||convert_to(p_new_password,'UTF8'),'sha256'),'hex'),updated_at=now() where id=v_user_id;
 return true;
end $$;

create or replace function public.app_list_expenses(p_token text) returns setof public.expenses
language plpgsql security definer set search_path=public,extensions as $$
declare v_user_id uuid;
begin
 select s.user_id into v_user_id from public.app_sessions s where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now();
 if v_user_id is null then raise exception 'Session invalide'; end if;
 return query select e.* from public.expenses e where e.user_id=v_user_id order by e.expense_date desc,e.created_at desc;
end $$;

create or replace function public.app_add_expense(p_token text,p_amount numeric,p_currency text,p_category text,p_description text,p_expense_date date,p_island text,p_payment_method text) returns public.expenses
language plpgsql security definer set search_path=public,extensions as $$
declare v_user_id uuid; v_row public.expenses;
begin
 select s.user_id into v_user_id from public.app_sessions s where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now();
 if v_user_id is null then raise exception 'Session invalide'; end if;
 insert into public.expenses(user_id,amount,currency,category,description,expense_date,island,payment_method) values(v_user_id,p_amount,coalesce(p_currency,'EUR'),coalesce(p_category,'Autre'),nullif(p_description,''),p_expense_date,nullif(p_island,''),nullif(p_payment_method,'')) returning * into v_row;
 return v_row;
end $$;

create or replace function public.app_delete_expense(p_token text,p_expense_id uuid) returns boolean
language plpgsql security definer set search_path=public,extensions as $$
declare v_user_id uuid; v_count int;
begin
 select s.user_id into v_user_id from public.app_sessions s where s.token_hash=encode(digest(p_token,'sha256'),'hex') and s.expires_at>now();
 if v_user_id is null then raise exception 'Session invalide'; end if;
 delete from public.expenses where id=p_expense_id and user_id=v_user_id;
 get diagnostics v_count=row_count; return v_count>0;
end $$;

revoke all on function public.app_login(text,text),public.app_session(text),public.app_logout(text),public.app_change_password(text,text),public.app_list_expenses(text),public.app_add_expense(text,numeric,text,text,text,date,text,text),public.app_delete_expense(text,uuid) from public;
grant execute on function public.app_login(text,text),public.app_session(text),public.app_logout(text),public.app_change_password(text,text),public.app_list_expenses(text),public.app_add_expense(text,numeric,text,text,text,date,text,text),public.app_delete_expense(text,uuid) to anon;
