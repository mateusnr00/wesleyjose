-- O bucket aceitava só imagem e 10 MB. O vídeo do topo da home precisa de mais
-- espaço; 60 MB cobre com folga um laço curto em 1080p bem comprimido, e ainda
-- barra alguém subir um arquivo bruto de câmera por engano.
update storage.buckets
set
  file_size_limit = 62914560,
  allowed_mime_types = array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif',
    'video/mp4', 'video/webm'
  ]
where id = 'imoveis';
