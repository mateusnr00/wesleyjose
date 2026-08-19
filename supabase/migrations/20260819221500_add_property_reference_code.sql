-- Código curto de referência, do tipo que o corretor dita no telefone
-- ("me manda o PR0142"). Gerado por sequência para nunca repetir, mesmo se
-- um imóvel for excluído.
create sequence public.property_reference_seq start 142;

alter table public.properties
  add column reference text not null default 'PR' || lpad(nextval('public.property_reference_seq')::text, 4, '0');

alter table public.properties add constraint reference_unica unique (reference);

-- Preenche os já cadastrados na ordem em que aparecem no site.
with numerados as (
  select id, row_number() over (order by sort_order, created_at) as n
  from public.properties
)
update public.properties p
set reference = 'PR' || lpad((100 + numerados.n)::text, 4, '0')
from numerados
where p.id = numerados.id;
