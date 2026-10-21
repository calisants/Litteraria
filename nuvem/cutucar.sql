-- Mots & Parole: CUTUCAR (opcional, só entre amigos aceitos). Rode DEPOIS de amigos.sql. Cole tudo no SQL Editor e clique em Run. Pode rodar mais de uma vez.
-- Guarda o endereço de envio de notificação (push) de quem ativou Amigos e quer receber cutucadas, e controla os limites:
-- só amigos aceitos, sem bloqueio, 1 cutucada por amigo por dia, no máximo 5 recebidas por dia, e a pessoa pode desligar.

alter table public.friend_profiles add column if not exists poke_ok boolean not null default true;

create table if not exists public.push_subs (
  user_id    uuid not null references auth.users(id) on delete cascade,
  endpoint   text primary key,
  p256dh     text not null,
  auth       text not null,
  updated_at timestamptz not null default now()
);
create index if not exists push_subs_user on public.push_subs (user_id);
create table if not exists public.pokes (
  sender   uuid not null references auth.users(id) on delete cascade,
  receiver uuid not null references auth.users(id) on delete cascade,
  day      date not null,
  primary key (sender, receiver, day)
);
alter table public.push_subs enable row level security;
alter table public.pokes enable row level security;
revoke all on public.push_subs, public.pokes from anon, authenticated;

-- minha ficha agora inclui «aceitar cutucadas»
create or replace function public.friends_me() returns jsonb language sql security definer set search_path = '' as $$
  select coalesce((select jsonb_build_object('code', code, 'nick', nick, 'share_streak', share_streak, 'share_words', share_words, 'poke_ok', poke_ok)
                   from public.friend_profiles where user_id = (select auth.uid())), 'null'::jsonb);
$$;

create or replace function public.friends_pokes_set(p_on boolean) returns void language sql security definer set search_path = '' as $$
  update public.friend_profiles set poke_ok = p_on where user_id = (select auth.uid());
$$;

-- o aparelho registra o endereço de envio (só quem ativou Amigos)
create or replace function public.push_save(p_endpoint text, p_p256dh text, p_auth text) returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid());
begin
  if me is null then raise exception 'sem sessão'; end if;
  if not exists (select 1 from public.friend_profiles where user_id = me) then raise exception 'ative Amigos primeiro'; end if;
  if p_endpoint !~ '^https://' or char_length(p_endpoint) > 1000 or char_length(p_p256dh) > 200 or char_length(p_auth) > 100 then raise exception 'inscrição inválida'; end if;
  insert into public.push_subs(user_id, endpoint, p256dh, auth) values (me, p_endpoint, p_p256dh, p_auth)
  on conflict (endpoint) do update set user_id = me, p256dh = p_p256dh, auth = p_auth, updated_at = now();
  -- no máximo 5 aparelhos por pessoa (fica com os mais recentes)
  delete from public.push_subs where user_id = me and endpoint not in
    (select endpoint from public.push_subs where user_id = me order by updated_at desc limit 5);
end $$;

create or replace function public.push_drop(p_endpoint text) returns void language sql security definer set search_path = '' as $$
  delete from public.push_subs where user_id = (select auth.uid()) and endpoint = p_endpoint;
$$;

-- confere tudo e registra a cutucada. Devolve {status, nick}: ok | nao_amigo | recusa | sem_aparelho | ja_hoje | limite
create or replace function public.friends_poke(p_uid uuid) returns jsonb language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); d date := (now() at time zone 'America/Sao_Paulo')::date; n int; mynick text; ok boolean;
begin
  if me is null or p_uid is null or p_uid = me then return jsonb_build_object('status', 'nao_amigo'); end if;
  select nick into mynick from public.friend_profiles where user_id = me;
  if mynick is null then return jsonb_build_object('status', 'nao_amigo'); end if;
  if not exists (select 1 from public.friendships where status = 'ok' and ((a = me and b = p_uid) or (a = p_uid and b = me)))
     or exists (select 1 from public.friend_blocks where (blocker = me and blocked = p_uid) or (blocker = p_uid and blocked = me)) then
    return jsonb_build_object('status', 'nao_amigo');
  end if;
  select poke_ok into ok from public.friend_profiles where user_id = p_uid;
  if ok is distinct from true then return jsonb_build_object('status', 'recusa'); end if;
  if not exists (select 1 from public.push_subs where user_id = p_uid) then return jsonb_build_object('status', 'sem_aparelho'); end if;
  delete from public.pokes where day < d - 7;
  if exists (select 1 from public.pokes where sender = me and receiver = p_uid and day = d) then return jsonb_build_object('status', 'ja_hoje'); end if;
  select count(*) into n from public.pokes where receiver = p_uid and day = d;
  if n >= 5 then return jsonb_build_object('status', 'limite'); end if;
  insert into public.pokes(sender, receiver, day) values (me, p_uid, d);
  return jsonb_build_object('status', 'ok', 'nick', mynick);
end $$;

-- a função de envio (Edge Function) desfaz o registro se nenhuma notificação saiu
create or replace function public.poke_undo(p_sender uuid, p_receiver uuid) returns void language sql security definer set search_path = '' as $$
  delete from public.pokes where sender = p_sender and receiver = p_receiver and day = (now() at time zone 'America/Sao_Paulo')::date;
$$;
revoke all on function public.poke_undo(uuid, uuid) from public, anon, authenticated;

-- desativar Amigos também apaga os endereços de envio
create or replace function public.friends_disable() returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid());
begin
  delete from public.friendships where a = me or b = me;
  delete from public.push_subs where user_id = me;
  delete from public.pokes where sender = me or receiver = me;
  delete from public.friend_profiles where user_id = me;
end $$;

revoke all on function public.friends_me(), public.friends_pokes_set(boolean), public.push_save(text, text, text), public.push_drop(text), public.friends_poke(uuid), public.friends_disable() from public, anon;
grant execute on function public.friends_me(), public.friends_pokes_set(boolean), public.push_save(text, text, text), public.push_drop(text), public.friends_poke(uuid), public.friends_disable() to authenticated;

grant execute on function public.poke_undo(uuid, uuid) to service_role;
grant select, delete on public.push_subs, public.pokes to service_role;
