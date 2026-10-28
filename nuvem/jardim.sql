-- Litteraria: JARDIM DOS AMIGOS E REGA (v1.75). Rode DEPOIS de amigos.sql, cutucar.sql, amigos2.sql, desafio.sql e avisos.sql.
-- Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez.
-- O que faz: (1) quem quiser (opção DESLIGADA por padrão) deixa os amigos aceitos verem o seu jardim: só quantas plantas há em cada estágio
-- (sombra, semente, flor, fruto) por idioma, nunca quais palavras nem erros; desligar apaga do servidor. (2) um amigo aceito pode «regar» o seu
-- jardim 1 vez por dia: é só brincadeira, não muda nada no seu progresso; fica registrado «regou hoje» e, se você aceita avisos e tem aparelho
-- inscrito, chega uma notificação (tom brincalhão ou neutro, à sua escolha).

alter table public.friend_profiles add column if not exists share_garden boolean not null default false;
alter table public.friend_profiles add column if not exists garden jsonb;
alter table public.friend_profiles add column if not exists cheeky boolean not null default true;

create table if not exists public.waterings (
  sender   uuid not null references auth.users(id) on delete cascade,
  receiver uuid not null references auth.users(id) on delete cascade,
  day      date not null,
  pushed   boolean not null default false,
  primary key (sender, receiver, day)
);
alter table public.waterings enable row level security;
revoke all on public.waterings from anon, authenticated;

-- escolhas: mostrar o jardim aos amigos; tom brincalhão nos avisos de rega. Desligar o jardim apaga o que estava guardado.
create or replace function public.friends_share3(p_garden boolean, p_cheeky boolean) returns void language sql security definer set search_path = '' as $$
  update public.friend_profiles set share_garden = coalesce(p_garden, false), cheeky = coalesce(p_cheeky, true),
    garden = case when coalesce(p_garden, false) then garden end
  where user_id = (select auth.uid());
$$;

-- o app envia as quantidades por idioma {"fr":[sombra,semente,flor,fruto],...}; só guarda se a pessoa deixou o jardim visível e se o formato é válido
create or replace function public.friends_garden(p_garden jsonb) returns void language plpgsql security definer set search_path = '' as $$
declare k text; v jsonb; clean jsonb := '{}'::jsonb; i int; ok boolean;
begin
  if jsonb_typeof(p_garden) is distinct from 'object' then return; end if;
  for k, v in select key, value from jsonb_each(p_garden) loop
    continue when k not in ('fr', 'it', 'en');
    continue when jsonb_typeof(v) is distinct from 'array' or jsonb_array_length(v) <> 4;
    ok := true;
    for i in 0..3 loop
      if jsonb_typeof(v -> i) is distinct from 'number' or (v ->> i) !~ '^[0-9]{1,5}$' then ok := false; end if;
    end loop;
    if ok then clean := clean || jsonb_build_object(k, v); end if;
  end loop;
  update public.friend_profiles set garden = case when share_garden and clean <> '{}'::jsonb then clean end where user_id = (select auth.uid());
end $$;

-- regar o jardim de um amigo. Devolve {status, nick}: ok | nao_amigo | sem_jardim | ja_hoje | limite
create or replace function public.garden_water(p_uid uuid) returns jsonb language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); d date := (now() at time zone 'America/Sao_Paulo')::date; n int; mynick text; sg boolean;
begin
  if me is null or p_uid is null or p_uid = me then return jsonb_build_object('status', 'nao_amigo'); end if;
  select nick into mynick from public.friend_profiles where user_id = me;
  if mynick is null then return jsonb_build_object('status', 'nao_amigo'); end if;
  if not exists (select 1 from public.friendships where status = 'ok' and ((a = me and b = p_uid) or (a = p_uid and b = me)))
     or exists (select 1 from public.friend_blocks where (blocker = me and blocked = p_uid) or (blocker = p_uid and blocked = me)) then
    return jsonb_build_object('status', 'nao_amigo');
  end if;
  select share_garden into sg from public.friend_profiles where user_id = p_uid;
  if sg is distinct from true then return jsonb_build_object('status', 'sem_jardim'); end if;
  delete from public.waterings where day < d - 7;
  if exists (select 1 from public.waterings where sender = me and receiver = p_uid and day = d) then return jsonb_build_object('status', 'ja_hoje'); end if;
  select count(*) into n from public.waterings where receiver = p_uid and day = d;
  if n >= 5 then return jsonb_build_object('status', 'limite'); end if;
  insert into public.waterings(sender, receiver, day) values (me, p_uid, d);
  return jsonb_build_object('status', 'ok', 'nick', mynick);
end $$;

-- usada pela Edge Function antes de enviar a notificação da rega. Só 1 aviso por rega e só se a pessoa aceita avisos e tem aparelho inscrito.
-- Devolve {status, nick, cheeky}: ok | sem_aviso
create or replace function public.garden_water_push(p_uid uuid) returns jsonb language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); d date := (now() at time zone 'America/Sao_Paulo')::date; mynick text; ok boolean; ch boolean; got int;
begin
  if me is null or p_uid is null or p_uid = me then return jsonb_build_object('status', 'sem_aviso'); end if;
  select nick into mynick from public.friend_profiles where user_id = me;
  select poke_ok, cheeky into ok, ch from public.friend_profiles where user_id = p_uid;
  if mynick is null or ok is distinct from true or not exists (select 1 from public.push_subs where user_id = p_uid) then
    return jsonb_build_object('status', 'sem_aviso');
  end if;
  update public.waterings set pushed = true where sender = me and receiver = p_uid and day = d and not pushed;
  get diagnostics got = row_count;
  if got = 0 then return jsonb_build_object('status', 'sem_aviso'); end if;
  return jsonb_build_object('status', 'ok', 'nick', mynick, 'cheeky', coalesce(ch, true));
end $$;

create or replace function public.water_undo(p_sender uuid, p_receiver uuid) returns void language sql security definer set search_path = '' as $$
  update public.waterings set pushed = false where sender = p_sender and receiver = p_receiver and day = (now() at time zone 'America/Sao_Paulo')::date;
$$;
revoke all on function public.water_undo(uuid, uuid) from public, anon, authenticated;
grant execute on function public.water_undo(uuid, uuid) to service_role;

-- minha ficha (todas as escolhas)
create or replace function public.friends_me() returns jsonb language sql security definer set search_path = '' as $$
  select coalesce((select jsonb_build_object('code', code, 'nick', nick, 'share_streak', share_streak, 'share_words', share_words,
                          'poke_ok', poke_ok, 'share_profile', share_profile, 'share_langs', share_langs,
                          'share_garden', share_garden, 'cheeky', cheeky)
                   from public.friend_profiles where user_id = (select auth.uid())), 'null'::jsonb);
$$;

-- lista de amigos: agora com 'garden' (só se o amigo deixou), 'wby' (eu reguei hoje) e 'wme' (ele regou o meu hoje)
create or replace function public.friends_list() returns jsonb language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); sw date := date_trunc('week', now() at time zone 'America/Sao_Paulo')::date; d date := (now() at time zone 'America/Sao_Paulo')::date;
begin
  return jsonb_build_object(
    'friends', coalesce((select jsonb_agg(jsonb_build_object('uid', p.user_id, 'nick', p.nick,
        'streak', case when p.share_streak then p.streak end, 'words', case when p.share_words then p.words end,
        'week', case when p.share_words then p.week end, 'at', p.stats_at,
        'avatar', case when p.share_profile then p.avatar end, 'motto', case when p.share_profile then p.motto end,
        'level', case when p.share_profile then p.level end, 'langs', case when p.share_langs then p.langs end,
        'garden', case when p.share_garden then p.garden end, 'sg', p.share_garden,
        'wby', exists (select 1 from public.waterings w where w.sender = me and w.receiver = p.user_id and w.day = d),
        'wme', exists (select 1 from public.waterings w where w.sender = p.user_id and w.receiver = me and w.day = d),
        'ch', (select case when c.status = 'on' then jsonb_build_object('st', 'on',
                  'mine', public.ch_cur(mp.ch_week, mp.ch_pages, sw), 'theirs', public.ch_cur(p.ch_week, p.ch_pages, sw),
                  'mine_prev', public.ch_prev(mp.ch_week, mp.ch_pages, mp.ch_prev_week, mp.ch_prev_pages, sw),
                  'theirs_prev', public.ch_prev(p.ch_week, p.ch_pages, p.ch_prev_week, p.ch_prev_pages, sw))
                else jsonb_build_object('st', case when c.a = me then 'sent' else 'recv' end) end
               from public.friend_challenges c, public.friend_profiles mp
               where mp.user_id = me and ((c.a = me and c.b = p.user_id) or (c.b = me and c.a = p.user_id)))) order by p.nick)
      from public.friendships f join public.friend_profiles p on p.user_id = case when f.a = me then f.b else f.a end
      where (f.a = me or f.b = me) and f.status = 'ok'
        and not exists (select 1 from public.friend_blocks k where (k.blocker = me and k.blocked = p.user_id) or (k.blocker = p.user_id and k.blocked = me))), '[]'::jsonb),
    'incoming', coalesce((select jsonb_agg(jsonb_build_object('uid', p.user_id, 'nick', p.nick) order by f.created_at)
      from public.friendships f join public.friend_profiles p on p.user_id = f.a
      where f.b = me and f.status = 'pending'
        and not exists (select 1 from public.friend_blocks k where (k.blocker = me and k.blocked = p.user_id) or (k.blocker = p.user_id and k.blocked = me))), '[]'::jsonb),
    'outgoing', coalesce((select jsonb_agg(jsonb_build_object('uid', p.user_id, 'nick', p.nick) order by f.created_at)
      from public.friendships f join public.friend_profiles p on p.user_id = f.b
      where f.a = me and f.status = 'pending'), '[]'::jsonb),
    'blocked', coalesce((select jsonb_agg(jsonb_build_object('uid', k.blocked, 'nick', coalesce(p.nick, 'pessoa')) order by k.at)
      from public.friend_blocks k left join public.friend_profiles p on p.user_id = k.blocked where k.blocker = me), '[]'::jsonb));
end $$;

-- desativar Amigos também apaga as regas
create or replace function public.friends_disable() returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid());
begin
  delete from public.friendships where a = me or b = me;
  delete from public.push_subs where user_id = me;
  delete from public.pokes where sender = me or receiver = me;
  delete from public.waterings where sender = me or receiver = me;
  delete from public.friend_profiles where user_id = me;
end $$;

revoke all on function public.friends_share3(boolean, boolean), public.friends_garden(jsonb), public.garden_water(uuid), public.garden_water_push(uuid),
  public.friends_me(), public.friends_list(), public.friends_disable() from public, anon;
grant execute on function public.friends_share3(boolean, boolean), public.friends_garden(jsonb), public.garden_water(uuid), public.garden_water_push(uuid),
  public.friends_me(), public.friends_list(), public.friends_disable() to authenticated;
