-- Estar autenticado não basta: a chave anônima é pública e qualquer um pode
-- se cadastrar. Escrita exige estar nesta allowlist, mantida só por SQL.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create policy "admin le a propria linha"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke execute on function public.is_admin() from anon;

drop policy "equipe le tudo" on public.properties;
drop policy "equipe cria" on public.properties;
drop policy "equipe edita" on public.properties;
drop policy "equipe exclui" on public.properties;

create policy "admin le tudo" on public.properties for select to authenticated using (public.is_admin());
create policy "admin cria" on public.properties for insert to authenticated with check (public.is_admin());
create policy "admin edita" on public.properties for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admin exclui" on public.properties for delete to authenticated using (public.is_admin());

-- Um autenticado fora da allowlist ainda precisa ver o site publicado.
create policy "publicados sao visiveis para autenticados"
  on public.properties for select to authenticated using (published = true);

drop policy "equipe envia fotos" on storage.objects;
drop policy "equipe substitui fotos" on storage.objects;
drop policy "equipe apaga fotos" on storage.objects;

create policy "admin envia fotos" on storage.objects for insert to authenticated
  with check (bucket_id = 'imoveis' and public.is_admin());
create policy "admin substitui fotos" on storage.objects for update to authenticated
  using (bucket_id = 'imoveis' and public.is_admin())
  with check (bucket_id = 'imoveis' and public.is_admin());
create policy "admin apaga fotos" on storage.objects for delete to authenticated
  using (bucket_id = 'imoveis' and public.is_admin());
