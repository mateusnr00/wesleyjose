-- O grant padrão de EXECUTE é para PUBLIC, então revogar só de `anon` não
-- surtia efeito. Revogamos de PUBLIC e devolvemos apenas onde é necessário.

-- Função de trigger: roda como dona da tabela, ninguém precisa chamá-la pela API.
revoke all on function public.touch_updated_at() from public, anon, authenticated;

-- is_admin() é avaliada dentro das policies, então o papel autenticado precisa
-- do EXECUTE. O anônimo não: nenhuma policy de `anon` a utiliza.
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
