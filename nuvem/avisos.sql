-- Litteraria: AVISOS DE CONVITE E DESAFIO (v1.55). Rode DEPOIS de amigos.sql, cutucar.sql, amigos2.sql e desafio.sql.
-- Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez.
-- O que faz: permite avisar por notificação quando alguém (1) te envia um convite de amizade, (2) aceita o seu convite,
-- (3) te propõe um desafio semanal, (4) aceita o seu desafio. Reaproveita a tela «Aceitar avisos dos amigos» e os endereços
-- de envio que já existem (cutucar.sql). Regras: só entre pessoas que de fato têm convite/amizade/desafio entre si,
-- sem bloqueio, só se a pessoa aceita avisos, no máximo 1 aviso de cada tipo por pessoa por dia e 10 avisos por dia recebidos.

-- a tabela de registro passa a guardar o tipo (cutucada continua igual: 'poke')
alter table public.pokes add column if not exists kind text not null default 'poke';
alter table public.pokes drop constraint if exists pokes_pkey;
alter table public.pokes add primary key (sender, receiver, day, kind);

-- cutucar: agora só conta cutucadas (os outros avisos não entram no limite de 5)
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
  if exists (select 1 from public.pokes where sender = me and receiver = p_uid and day = d and kind = 'poke') then return jsonb_build_object('status', 'ja_hoje'); end if;
  select count(*) into n from public.pokes where receiver = p_uid and day = d and kind = 'poke';
  if n >= 5 then return jsonb_build_object('status', 'limite'); end if;
  insert into public.pokes(sender, receiver, day, kind) values (me, p_uid, d, 'poke');
  return jsonb_build_object('status', 'ok', 'nick', mynick);
end $$;

create or replace function public.poke_undo(p_sender uuid, p_receiver uuid) returns void language sql security definer set search_path = '' as $$
  delete from public.pokes where sender = p_sender and receiver = p_receiver and kind = 'poke' and day = (now() at time zone 'America/Sao_Paulo')::date;
$$;
revoke all on function public.poke_undo(uuid, uuid) from public, anon, authenticated;
grant execute on function public.poke_undo(uuid, uuid) to service_role;

-- novos avisos. p_kind: invite | accepted | challenge | ch_ok.
-- invite: pode usar p_code (o código que você digitou) no lugar de p_uid. Devolve {status, nick, uid}:
-- ok | nao_amigo | recusa | sem_aparelho | ja_hoje | limite
create or replace function public.friends_notify(p_kind text, p_uid uuid default null, p_code text default null) returns jsonb language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); d date := (now() at time zone 'America/Sao_Paulo')::date; n int; mynick text; ok boolean; t uuid := p_uid; valid boolean := false;
begin
  if me is null or p_kind not in ('invite', 'accepted', 'challenge', 'ch_ok') then return jsonb_build_object('status', 'nao_amigo'); end if;
  if t is null and p_kind = 'invite' and p_code is not null then
    select user_id into t from public.friend_profiles where code = upper(trim(p_code));
  end if;
  if t is null or t = me then return jsonb_build_object('status', 'nao_amigo'); end if;
  select nick into mynick from public.friend_profiles where user_id = me;
  if mynick is null then return jsonb_build_object('status', 'nao_amigo'); end if;
  if exists (select 1 from public.friend_blocks where (blocker = me and blocked = t) or (blocker = t and blocked = me)) then
    return jsonb_build_object('status', 'nao_amigo');
  end if;
  -- só avisa o que realmente existe no banco, e foi iniciado por quem chamou
  if p_kind = 'invite' then
    valid := exists (select 1 from public.friendships where a = me and b = t and status = 'pending');
  elsif p_kind = 'accepted' then
    valid := exists (select 1 from public.friendships where a = t and b = me and status = 'ok');
  elsif p_kind = 'challenge' then
    valid := exists (select 1 from public.friend_challenges where a = me and b = t and status = 'pending');
  else
    valid := exists (select 1 from public.friend_challenges where a = t and b = me and status = 'on');
  end if;
  if not valid then return jsonb_build_object('status', 'nao_amigo'); end if;
  select poke_ok into ok from public.friend_profiles where user_id = t;
  if ok is distinct from true then return jsonb_build_object('status', 'recusa'); end if;
  if not exists (select 1 from public.push_subs where user_id = t) then return jsonb_build_object('status', 'sem_aparelho'); end if;
  if exists (select 1 from public.pokes where sender = me and receiver = t and day = d and kind = p_kind) then return jsonb_build_object('status', 'ja_hoje'); end if;
  select count(*) into n from public.pokes where receiver = t and day = d and kind <> 'poke';
  if n >= 10 then return jsonb_build_object('status', 'limite'); end if;
  insert into public.pokes(sender, receiver, day, kind) values (me, t, d, p_kind);
  return jsonb_build_object('status', 'ok', 'nick', mynick, 'uid', t);
end $$;

create or replace function public.notify_undo(p_sender uuid, p_receiver uuid, p_kind text) returns void language sql security definer set search_path = '' as $$
  delete from public.pokes where sender = p_sender and receiver = p_receiver and kind = p_kind and day = (now() at time zone 'America/Sao_Paulo')::date;
$$;

revoke all on function public.friends_poke(uuid), public.friends_notify(text, uuid, text) from public, anon;
grant execute on function public.friends_poke(uuid), public.friends_notify(text, uuid, text) to authenticated;
revoke all on function public.notify_undo(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.notify_undo(uuid, uuid, text) to service_role;
