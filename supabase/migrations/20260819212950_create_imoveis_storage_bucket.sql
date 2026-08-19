-- Bucket público: as fotos aparecem no site sem URL assinada, e o Next
-- consegue otimizá-las. Escrita continua restrita a quem está autenticado.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imoveis', 'imoveis', true, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "fotos sao publicas para leitura"
  on storage.objects for select to anon, authenticated using (bucket_id = 'imoveis');

create policy "equipe envia fotos"
  on storage.objects for insert to authenticated with check (bucket_id = 'imoveis');

create policy "equipe substitui fotos"
  on storage.objects for update to authenticated
  using (bucket_id = 'imoveis') with check (bucket_id = 'imoveis');

create policy "equipe apaga fotos"
  on storage.objects for delete to authenticated using (bucket_id = 'imoveis');
