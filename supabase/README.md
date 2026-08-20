# Schema do Supabase

As migrações abaixo já estão aplicadas no projeto **Premium Imoveis** (`anwzapsyleltgqpwzzzc`, região `sa-east-1`). Ficam versionadas aqui para o schema não existir apenas dentro do painel do Supabase.

| Versão | O que faz |
| --- | --- |
| `20260819212940_create_properties` | Tabela `properties`, enums, índices, trigger de `updated_at` e RLS inicial |
| `20260819212950_create_imoveis_storage_bucket` | Bucket `imoveis` no Storage e suas policies |
| `20260819213112_restrict_writes_to_admin_allowlist` | Tabela `admins` e `is_admin()`; escrita passa a exigir allowlist |
| `20260819214012_tighten_function_grants` | Revoga `EXECUTE` das funções `SECURITY DEFINER` de quem não precisa |
| `20260819221500_add_property_reference_code` | Coluna `reference` com código curto (`PR0101`) gerado por sequência |
| `20260820160000_create_editable_content` | Tabelas `content_blocks` e `content_items`, que guardam a copy editável |

## Dar acesso a mais alguém

1. Crie o usuário em Authentication → Users no painel do Supabase.
2. Rode:

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'pessoa@exemplo.com';
```

Sem o passo 2 a pessoa consegue logar, mas não escreve nada, nem no banco, nem no Storage.

## Verificando a RLS

Para confirmar que o papel anônimo continua bloqueado:

```sql
set local role anon;
select count(*) from public.properties;              -- só os publicados
insert into public.properties (slug, name, district)
  values ('x', 'x', 'x');                            -- deve falhar com 42501
reset role;
```
