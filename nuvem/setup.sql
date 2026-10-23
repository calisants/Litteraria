-- Litteraria: banco de dados da conta (Supabase). Cole tudo no SQL Editor do projeto e clique em Run.
-- Cada pessoa só enxerga e altera as próprias linhas (RLS). A chave "anon" do app é pública por desenho; quem protege os dados são estas regras.

create table if not exists public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null,
  app        text,
  updated_at timestamptz not null default now()
);
create table if not exists public.consents (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  policy_version text not null,
  age_ok         boolean not null,
  at             timestamptz not null default now()
);

alter table public.progress enable row level security;
alter table public.consents enable row level security;

drop policy if exists "progress_select" on public.progress;
drop policy if exists "progress_insert" on public.progress;
drop policy if exists "progress_update" on public.progress;
drop policy if exists "progress_delete" on public.progress;
create policy "progress_select" on public.progress for select to authenticated using (user_id = (select auth.uid()));
create policy "progress_insert" on public.progress for insert to authenticated with check (user_id = (select auth.uid()));
create policy "progress_update" on public.progress for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "progress_delete" on public.progress for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists "consents_select" on public.consents;
drop policy if exists "consents_insert" on public.consents;
drop policy if exists "consents_update" on public.consents;
create policy "consents_select" on public.consents for select to authenticated using (user_id = (select auth.uid()));
create policy "consents_insert" on public.consents for insert to authenticated with check (user_id = (select auth.uid()));
create policy "consents_update" on public.consents for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- a data de atualização vem sempre do relógio do servidor (o app usa isso para detectar conflito entre aparelhos)
create or replace function public.touch_progress() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists progress_touch on public.progress;
create trigger progress_touch before insert or update on public.progress for each row execute function public.touch_progress();

-- limite de tamanho do salvamento (2 MB)
alter table public.progress drop constraint if exists progress_size;
alter table public.progress add constraint progress_size check (pg_column_size(data) < 2000000);

-- "Apagar minha conta": remove o usuário; as linhas das duas tabelas somem junto (on delete cascade)
create or replace function public.delete_me() returns void language sql security definer set search_path = '' as $$
  delete from auth.users where id = (select auth.uid());
$$;
revoke all on function public.delete_me() from public, anon;
grant execute on function public.delete_me() to authenticated;

-- usado pelo aviso automático que impede o projeto gratuito de ser pausado por inatividade
create or replace function public.ping() returns int language sql stable as $$ select 1 $$;
grant execute on function public.ping() to anon, authenticated;
