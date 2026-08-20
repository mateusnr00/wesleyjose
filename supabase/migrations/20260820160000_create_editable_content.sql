-- Conteúdo editável do site.
--
-- O banco guarda apenas o que foi alterado no painel; a forma dos campos e o
-- texto padrão vivem em lib/content-schema.ts. A leitura mescla os dois, então
-- um campo que ninguém tocou continua vindo do código e um deploy pode
-- acrescentar campos novos sem migração de dados.

create table public.content_blocks (
  key text primary key,
  fields jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  collection text not null,
  sort_order integer not null default 0,
  fields jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index content_items_collection_idx on public.content_items (collection, sort_order, created_at);

create trigger content_blocks_touch
  before update on public.content_blocks
  for each row execute function public.touch_updated_at();

create trigger content_items_touch
  before update on public.content_items
  for each row execute function public.touch_updated_at();

alter table public.content_blocks enable row level security;
alter table public.content_items enable row level security;

create policy "conteudo visivel para todos"
  on public.content_blocks for select to anon, authenticated using (true);

create policy "itens visiveis para todos"
  on public.content_items for select to anon, authenticated using (true);

create policy "admin escreve blocos"
  on public.content_blocks for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "admin escreve itens"
  on public.content_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
