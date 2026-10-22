-- Mots & Parole: DESAFIO SEMANAL ENTRE AMIGOS (v1.50). Cole no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez.
-- Rode DEPOIS de amigos.sql, cutucar.sql e amigos2.sql.
-- Como funciona: um amigo aceito propõe um desafio e o outro aceita (nada começa sem os dois). Cada um vê só o TOTAL de
-- lições concluídas na semana (segunda a domingo) dele e do outro, e o resultado da semana passada. Nenhum idioma, dia ou lição.
-- O total só é guardado enquanto o desafio estiver ativo; ao encerrar (por qualquer um), remover, bloquear ou desativar Amigos,
-- o número é apagado do servidor.

create table if not exists public.friend_challenges (
  a          uuid not null references auth.users(id) on delete cascade,  -- quem propôs
  b          uuid not null references auth.users(id) on delete cascade,  -- quem foi desafiado
  status     text not null check (status in ('pending','on')),
  created_at timestamptz not null default now(),
  primary key (a, b),
  check (a <> b)
);
create unique index if not exists friend_challenges_pair on public.friend_challenges (least(a, b), greatest(a, b));
alter table public.friend_challenges enable row level security;
revoke all on public.friend_challenges from anon, authenticated;

alter table public.friend_profiles add column if not exists ch_week       date;
alter table public.friend_profiles add column if not exists ch_pages      int not null default 0;
alter table public.friend_profiles add column if not exists ch_prev_week  date;
alter table public.friend_profiles add column if not exists ch_prev_pages int not null default 0;

-- apaga o número da semana de quem não tem mais nenhum desafio ativo
create or replace function public.ch_tidy(u uuid) returns void language sql security definer set search_path = '' as $$
  update public.friend_profiles set ch_week = null, ch_pages = 0, ch_prev_week = null, ch_prev_pages = 0
  where user_id = u and not exists (select 1 from public.friend_challenges c where c.status = 'on' and (c.a = u or c.b = u));
$$;
revoke all on function public.ch_tidy(uuid) from public, anon, authenticated;

-- quando uma amizade acaba (remover, bloquear, denunciar, desativar), o desafio acaba junto
create or replace function public.ch_cleanup() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  delete from public.friend_challenges where (a = old.a and b = old.b) or (a = old.b and b = old.a);
  perform public.ch_tidy(old.a); perform public.ch_tidy(old.b);
  return old;
end $$;
revoke all on function public.ch_cleanup() from public, anon, authenticated;
drop trigger if exists friendships_ch on public.friendships;
create trigger friendships_ch after delete on public.friendships for each row execute function public.ch_cleanup();

-- propor: 'enviado' | 'ja' | 'nao_amigo'
create or replace function public.challenge_propose(p_uid uuid) returns text language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid());
begin
  if me is null or p_uid is null or p_uid = me then return 'nao_amigo'; end if;
  if not exists (select 1 from public.friendships where status = 'ok' and ((a = me and b = p_uid) or (a = p_uid and b = me)))
     or exists (select 1 from public.friend_blocks where (blocker = me and blocked = p_uid) or (blocker = p_uid and blocked = me)) then return 'nao_amigo'; end if;
  if exists (select 1 from public.friend_challenges where (a = me and b = p_uid) or (a = p_uid and b = me)) then return 'ja'; end if;
  insert into public.friend_challenges(a, b, status) values (me, p_uid, 'pending');
  return 'enviado';
end $$;

-- responder a um desafio recebido (aceitar ou recusar)
create or replace function public.challenge_respond(p_uid uuid, p_accept boolean) returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid());
begin
  if p_accept then update public.friend_challenges set status = 'on' where a = p_uid and b = me and status = 'pending';
  else delete from public.friend_challenges where a = p_uid and b = me and status = 'pending'; end if;
end $$;

-- encerrar ou cancelar (qualquer um dos dois)
create or replace function public.challenge_end(p_uid uuid) returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid());
begin
  delete from public.friend_challenges where (a = me and b = p_uid) or (a = p_uid and b = me);
  perform public.ch_tidy(me); perform public.ch_tidy(p_uid);
end $$;

-- o app envia o total de lições concluídas na semana (p_week = segunda-feira); só é guardado se houver desafio ativo.
-- A semana é contada pelo calendário de Brasília (segunda a domingo).
create or replace function public.challenge_stats(p_week date, p_pages int) returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); sw date := date_trunc('week', now() at time zone 'America/Sao_Paulo')::date; w date; n int;
begin
  if me is null or p_week is null or abs(p_week - sw) > 1 then return; end if;
  if not exists (select 1 from public.friend_challenges where status = 'on' and (a = me or b = me)) then return; end if;
  n := least(greatest(coalesce(p_pages, 0), 0), 10000);
  select ch_week into w from public.friend_profiles where user_id = me;
  if w is distinct from sw then
    update public.friend_profiles set
      ch_prev_week = case when w = sw - 7 then w end,
      ch_prev_pages = case when w = sw - 7 then ch_pages else 0 end,
      ch_week = sw, ch_pages = n
    where user_id = me;
  else
    update public.friend_profiles set ch_pages = n where user_id = me;
  end if;
end $$;

create or replace function public.ch_cur(w date, n int, sw date) returns int language sql immutable set search_path = '' as $$
  select case when w = sw then n else 0 end;
$$;
create or replace function public.ch_prev(w date, n int, pw date, pn int, sw date) returns int language sql immutable set search_path = '' as $$
  select case when w = sw - 7 then n when pw = sw - 7 then pn end;
$$;

-- a lista de amigos agora traz o desafio de cada amizade (só os totais da semana, e só se o desafio estiver ativo)
create or replace function public.friends_list() returns jsonb language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); sw date := date_trunc('week', now() at time zone 'America/Sao_Paulo')::date;
begin
  return jsonb_build_object(
    'friends', coalesce((select jsonb_agg(jsonb_build_object('uid', p.user_id, 'nick', p.nick,
        'streak', case when p.share_streak then p.streak end, 'words', case when p.share_words then p.words end,
        'week', case when p.share_words then p.week end, 'at', p.stats_at,
        'avatar', case when p.share_profile then p.avatar end, 'motto', case when p.share_profile then p.motto end,
        'level', case when p.share_profile then p.level end, 'langs', case when p.share_langs then p.langs end,
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

revoke all on function public.challenge_propose(uuid), public.challenge_respond(uuid, boolean), public.challenge_end(uuid), public.challenge_stats(date, int), public.friends_list() from public, anon;
grant execute on function public.challenge_propose(uuid), public.challenge_respond(uuid, boolean), public.challenge_end(uuid), public.challenge_stats(date, int), public.friends_list() to authenticated;
grant execute on function public.ch_cur(date, int, date), public.ch_prev(date, int, date, int, date) to authenticated;
