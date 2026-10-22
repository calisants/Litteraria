-- Mots & Parole: AMIGOS, parte 2 (v1.47). Cole no SQL Editor do Supabase e clique em Run. Pode rodar mais de uma vez.
-- Acrescenta ao perfil de amigo: ícone, frase, nível e idiomas. Tudo continua OPCIONAL: cada pessoa liga ou desliga
-- «ícone, frase e nível» e «idiomas que estudo» (começam desligados). Quem desliga tem os dados apagados do servidor.
-- Rode DEPOIS de amigos.sql e cutucar.sql.

alter table public.friend_profiles add column if not exists share_profile boolean not null default false;
alter table public.friend_profiles add column if not exists share_langs   boolean not null default false;
alter table public.friend_profiles add column if not exists avatar text check (avatar is null or avatar ~ '^[a-z]{1,20}$');
alter table public.friend_profiles add column if not exists motto  text check (motto is null or char_length(motto) <= 60);
alter table public.friend_profiles add column if not exists level  int  check (level is null or level between 1 and 1000);
alter table public.friend_profiles add column if not exists langs  jsonb;

-- escolhas de compartilhamento do perfil; desligar apaga o que já estava guardado
create or replace function public.friends_share2(p_profile boolean, p_langs boolean) returns void language sql security definer set search_path = '' as $$
  update public.friend_profiles set share_profile = p_profile, share_langs = p_langs,
    avatar = case when p_profile then avatar end, motto = case when p_profile then motto end, level = case when p_profile then level end,
    langs  = case when p_langs then langs end
  where user_id = (select auth.uid());
$$;

-- o app envia ícone, frase, nível e páginas concluídas por idioma; só ficam guardados os que a pessoa escolheu compartilhar
create or replace function public.friends_profile(p_avatar text, p_motto text, p_level int, p_langs jsonb) returns void language sql security definer set search_path = '' as $$
  update public.friend_profiles set
    avatar = case when share_profile and p_avatar ~ '^[a-z]{1,20}$' then p_avatar end,
    motto  = case when share_profile then nullif(left(btrim(coalesce(p_motto, '')), 60), '') end,
    level  = case when share_profile and p_level between 1 and 1000 then p_level end,
    langs  = case when share_langs and jsonb_typeof(p_langs) = 'object' then p_langs end
  where user_id = (select auth.uid());
$$;

create or replace function public.friends_me() returns jsonb language sql security definer set search_path = '' as $$
  select coalesce((select jsonb_build_object('code', code, 'nick', nick, 'share_streak', share_streak, 'share_words', share_words,
                          'poke_ok', poke_ok, 'share_profile', share_profile, 'share_langs', share_langs)
                   from public.friend_profiles where user_id = (select auth.uid())), 'null'::jsonb);
$$;

create or replace function public.friends_list() returns jsonb language plpgsql security definer set search_path = '' as $$
declare me uuid := (select auth.uid());
begin
  return jsonb_build_object(
    'friends', coalesce((select jsonb_agg(jsonb_build_object('uid', p.user_id, 'nick', p.nick,
        'streak', case when p.share_streak then p.streak end, 'words', case when p.share_words then p.words end,
        'week', case when p.share_words then p.week end, 'at', p.stats_at,
        'avatar', case when p.share_profile then p.avatar end, 'motto', case when p.share_profile then p.motto end,
        'level', case when p.share_profile then p.level end, 'langs', case when p.share_langs then p.langs end) order by p.nick)
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

revoke all on function public.friends_share2(boolean, boolean), public.friends_profile(text, text, int, jsonb), public.friends_me(), public.friends_list() from public, anon;
grant execute on function public.friends_share2(boolean, boolean), public.friends_profile(text, text, int, jsonb), public.friends_me(), public.friends_list() to authenticated;
