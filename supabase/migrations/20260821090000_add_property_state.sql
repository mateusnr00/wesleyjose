-- A empresa passou a atuar em Goiás, São Paulo e Santa Catarina. Sem coluna de
-- estado, o site mostraria "Goiânia" para tudo e um imóvel de Balneário
-- Camboriú apareceria como se fosse goiano.
alter table public.properties
  add column state text not null default 'GO';

alter table public.properties
  add constraint estado_sigla check (state ~ '^[A-Z]{2}$');

create index properties_state_idx on public.properties (state, district);
