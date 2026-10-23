-- Litteraria: AMIGOS (opcional). Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez.
-- Princípios: tudo desligado até a pessoa ativar; só apelido + o que ela escolher mostrar (sequência de dias, palavras, semana);
-- sem chat, sem foto, sem busca de pessoas (só entra por código); bloquear e denunciar; sair apaga tudo.
-- As tabelas ficam fechadas (RLS ligada e sem política): todo acesso passa pelas funções abaixo, que só enxergam a própria pessoa e os amigos aceitos.

create table if not exists public.friend_profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  code         text not null unique,
  nick         text not null check (char_length(nick) between 2 and 20),
  share_streak boolean not null default false,
  share_words  boolean not null default false,
  streak       int not null default 0,
  words        int not null default 0,
  week         int not null default 0,
  stats_at     timestamptz,
  created_at   timestamptz not null default now()
);
create table if not exists public.friendships (
  a          uuid not null references auth.users(id) on delete cascade,  -- quem convidou
  b          uuid not null references auth.users(id) on delete cascade,  -- quem foi convidado
  status     text not null check (status in ('pending','ok')),
  created_at timestamptz not null default now(),
  primary key (a, b),
  check (a <> b)
);
create unique index if not exists friendships_pair on public.friendships (least(a, b), greatest(a, b));
create table if not exists public.friend_blocks (
  blocker uuid not null references auth.users(id) on delete cascade,
  blocked uuid not null references auth.users(id) on delete cascade,
  at      timestamptz not null default now(),
  primary key (blocker, blocked)
);
create table if not exists public.friend_reports (
  id       bigserial primary key,
  reporter uuid references auth.users(id) on delete set null,
  reported uuid references auth.users(id) on delete cascade,
  reason   text check (char_length(reason) <= 300),
  at       timestamptz not null default now()
);

alter table public.friend_profiles enable row level security;
alter table public.friendships enable row level security;
alter table public.friend_blocks enable row level security;
alter table public.friend_reports enable row level security;
revoke all on public.friend_profiles, public.friendships, public.friend_blocks, public.friend_reports from anon, authenticated;

-- minha ficha (ou vazio se não ativei)
create or replace function public.friends_me() returns jsonb language sql security definer set search_path = '' as $$
  select coalesce((select jsonb_build_object('code', code, 'nick', nick, 'share_streak', share_streak, 'share_words', share_words)
                   from public.friend_profiles where user_id = (select auth.uid())), 'null'::jsonb);
$$;

-- ativar (ou trocar o apelido); devolve o código de amigo
create or replace function public.friends_enable(p_nick text) returns text language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); c text; i int := 0; chars text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
begin
  if me is null then raise exception 'sem sessão'; end if;
  p_nick := btrim(p_nick);
  if char_length(p_nick) < 2 or char_length(p_nick) > 20 then raise exception 'apelido deve ter de 2 a 20 letras'; end if;
  select code into c from public.friend_profiles where user_id = me;
  if c is not null then update public.friend_profiles set nick = p_nick where user_id = me; return c; end if;
  loop
    c := '';
    for k in 1..8 loop c := c || substr(chars, 1 + floor(random() * length(chars))::int, 1); end loop;
    begin
      insert into public.friend_profiles(user_id, code, nick) values (me, c, p_nick);
      return c;
    exception when unique_violation then
      i := i + 1; if i > 20 then raise exception 'tente de novo'; end if;
    end;
  end loop;
end $$;

-- desativar: apaga ficha, convites e amizades (bloqueios que eu fiz ficam, para ninguém voltar a me procurar)
create or replace function public.friends_disable() returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid());
begin
  delete from public.friendships where a = me or b = me;
  delete from public.friend_profiles where user_id = me;
end $$;

create or replace function public.friends_share(p_streak boolean, p_words boolean) returns void language sql security definer set search_path = '' as $$
  update public.friend_profiles set share_streak = p_streak, share_words = p_words,
    streak = case when p_streak then streak else 0 end,
    words  = case when p_words then words else 0 end,
    week   = case when p_words then week else 0 end
  where user_id = (select auth.uid());
$$;

-- o app envia os números; só ficam guardados os que a pessoa escolheu compartilhar
create or replace function public.friends_stats(p_streak int, p_words int, p_week int) returns void language sql security definer set search_path = '' as $$
  update public.friend_profiles set
    streak = case when share_streak then least(greatest(p_streak, 0), 100000) else 0 end,
    words  = case when share_words then least(greatest(p_words, 0), 1000000) else 0 end,
    week   = case when share_words then least(greatest(p_week, 0), 1000000) else 0 end,
    stats_at = now()
  where user_id = (select auth.uid());
$$;

-- convidar por código: 'enviado' | 'ja' | 'nao_encontrado' | 'limite'
create or replace function public.friends_request(p_code text) returns text language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid()); t uuid; n int;
begin
  if me is null then raise exception 'sem sessão'; end if;
  if not exists (select 1 from public.friend_profiles where user_id = me) then raise exception 'ative Amigos primeiro'; end if;
  select user_id into t from public.friend_profiles where code = upper(btrim(p_code));
  if t is null or t = me then return 'nao_encontrado'; end if;
  if exists (select 1 from public.friend_blocks where (blocker = t and blocked = me) or (blocker = me and blocked = t)) then return 'nao_encontrado'; end if;
  if exists (select 1 from public.friendships where (a = me and b = t) or (a = t and b = me)) then return 'ja'; end if;
  select count(*) into n from public.friendships where a = me and status = 'pending';
  if n >= 20 then return 'limite'; end if;
  insert into public.friendships(a, b, status) values (me, t, 'pending');
  return 'enviado';
end $$;

create or replace function public.friends_respond(p_uid uuid, p_accept boolean) returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid());
begin
  if p_accept then update public.friendships set status = 'ok' where a = p_uid and b = me and status = 'pending';
  else delete from public.friendships where a = p_uid and b = me and status = 'pending'; end if;
end $$;

create or replace function public.friends_remove(p_uid uuid) returns void language sql security definer set search_path = '' as $$
  delete from public.friendships where (a = (select auth.uid()) and b = p_uid) or (b = (select auth.uid()) and a = p_uid);
$$;

create or replace function public.friends_block(p_uid uuid) returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid());
begin
  if p_uid = me then return; end if;
  insert into public.friend_blocks(blocker, blocked) values (me, p_uid) on conflict do nothing;
  delete from public.friendships where (a = me and b = p_uid) or (b = me and a = p_uid);
end $$;

create or replace function public.friends_unblock(p_uid uuid) returns void language sql security definer set search_path = '' as $$
  delete from public.friend_blocks where blocker = (select auth.uid()) and blocked = p_uid;
$$;

-- denunciar também bloqueia
create or replace function public.friends_report(p_uid uuid, p_reason text) returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid());
begin
  if p_uid = me then return; end if;
  insert into public.friend_reports(reporter, reported, reason) values (me, p_uid, left(coalesce(p_reason, ''), 300));
  perform public.friends_block(p_uid);
end $$;

-- lista: amigos aceitos (com os números que cada um escolheu mostrar), convites recebidos e enviados, e bloqueados
create or replace function public.friends_list() returns jsonb language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid());
begin
  return jsonb_build_object(
    'friends', coalesce((select jsonb_agg(jsonb_build_object('uid', p.user_id, 'nick', p.nick,
        'streak', case when p.share_streak then p.streak end, 'words', case when p.share_words then p.words end,
        'week', case when p.share_words then p.week end, 'at', p.stats_at) order by p.nick)
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

revoke all on function public.friends_me(), public.friends_enable(text), public.friends_disable(), public.friends_share(boolean, boolean),
  public.friends_stats(int, int, int), public.friends_request(text), public.friends_respond(uuid, boolean), public.friends_remove(uuid),
  public.friends_block(uuid), public.friends_unblock(uuid), public.friends_report(uuid, text), public.friends_list() from public, anon;
grant execute on function public.friends_me(), public.friends_enable(text), public.friends_disable(), public.friends_share(boolean, boolean),
  public.friends_stats(int, int, int), public.friends_request(text), public.friends_respond(uuid, boolean), public.friends_remove(uuid),
  public.friends_block(uuid), public.friends_unblock(uuid), public.friends_report(uuid, text), public.friends_list() to authenticated;
