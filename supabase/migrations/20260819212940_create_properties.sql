-- Tipos do domínio. Enum em vez de text para o banco recusar valor inválido
-- mesmo que algum cliente futuro escreva fora do painel.
create type property_purpose as enum ('venda', 'locacao');
create type property_kind as enum ('residencia', 'cobertura', 'apartamento', 'lancamento', 'off-market');
create type property_status as enum ('disponivel', 'exclusivo', 'vendido', 'lancamento');

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  district text not null,
  city text not null default 'Goiânia',
  purpose property_purpose not null default 'venda',
  kind property_kind not null default 'residencia',
  status property_status not null default 'disponivel',
  -- null significa "sob consulta", que é diferente de preço zero.
  price numeric(14, 2),
  area integer not null default 0,
  bedrooms integer not null default 0,
  suites integer not null default 0,
  parking integer not null default 0,
  headline text not null default '',
  description text not null default '',
  features text[] not null default '{}',
  image text,
  gallery text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint area_nao_negativa check (area >= 0),
  constraint preco_nao_negativo check (price is null or price >= 0)
);

create index properties_publicos_idx on public.properties (published, sort_order, created_at desc);
create index properties_district_idx on public.properties (district);

create or replace function public.touch_updated_at()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger properties_touch_updated_at
  before update on public.properties
  for each row execute function public.touch_updated_at();

alter table public.properties enable row level security;

create policy "publicados sao visiveis para todos"
  on public.properties for select to anon using (published = true);

create policy "equipe le tudo" on public.properties for select to authenticated using (true);
create policy "equipe cria" on public.properties for insert to authenticated with check (true);
create policy "equipe edita" on public.properties for update to authenticated using (true) with check (true);
create policy "equipe exclui" on public.properties for delete to authenticated using (true);
