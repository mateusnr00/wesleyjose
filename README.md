# Premium Imóveis

Site institucional e de captação da **Premium Imóveis**, consultoria imobiliária de alto padrão em Goiânia ([@premiumimoveisgo](https://www.instagram.com/premiumimoveisgo/)).

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript.

## Rodando

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
```

## Estrutura

| Rota | O que é |
| --- | --- |
| `/` | Home: hero com busca, bifurcação comprar/vender, sobre, portfólio, atalhos por bairro, consultoria, captação de vendedores, depoimentos, newsletter, contato |
| `/imoveis` | Catálogo com filtros por tipo, bairro, faixa de valor e quartos, ordenação e paginação (9 por página). Os filtros vivem na URL, então cada combinação é um link compartilhável |
| `/imoveis/[slug]` | Página do imóvel: topo com foto em tela cheia, faixa de números, índice fixo com marcação da seção, galeria com visor em tela cheia, mapa sob demanda, similares e barra fixa de contato no mobile |
| `/vender` | Funil de proprietários: avaliação gratuita em formulário de 3 etapas, argumentos, processo em 4 passos e FAQ |

## Deploy na Vercel

O projeto é um Next.js padrão, detectado automaticamente pela Vercel, então não precisa de `vercel.json` nem de configuração de build.

**Para ligar o deploy automático:**

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe `mateusnr00/wesleyjose`
3. Deixe as configurações como vieram (framework Next.js, build `next build`) e clique em **Deploy**

A partir daí, todo push no branch padrão vira deploy de produção, e todo branch novo ganha uma URL de preview.

### Detalhes que importam

- **Branch de produção**: hoje o branch padrão do repositório é `claude/website-inspiration-improvements-ge6ecl`, porque foi o primeiro a existir. A Vercel usa o branch padrão como produção. Se preferir um nome convencional, crie um `main` a partir dele e troque o padrão em Settings → Branches no GitHub **antes** de importar.
- **Trocar de domínio não exige mexer no código.** As tags de Open Graph, o `sitemap.xml` e o `robots.txt` leem o domínio de produção que a Vercel injeta no build (`VERCEL_PROJECT_PRODUCTION_URL`). Vincule o domínio novo em Settings → Domains, refaça o deploy e pronto. Não existe domínio fixo no código de propósito: seria um endereço envelhecendo em silêncio dentro do sitemap.
- **`NEXT_PUBLIC_SITE_URL`** só é necessária quando **mais de um domínio** aponta para o projeto, para escolher qual é o canônico. Ela tem prioridade sobre o que a Vercel injeta.
- **Imagens**: `images.unsplash.com` está liberado no `next.config.mjs`. Ao trocar pelas fotos reais, ajuste `remotePatterns` para o domínio de onde elas vierem, ou coloque os arquivos em `public/` e use caminhos locais.

## Desempenho e acessibilidade

Medido com Lighthouse sobre o build de produção, nas quatro páginas públicas:

| | Desempenho | Acessibilidade | Boas práticas | SEO |
| --- | --- | --- | --- | --- |
| Mobile | 96 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 96 a 100 | 100 |

`CLS 0` em todas as páginas, nas duas plataformas.

Decisões que sustentam esses números. Mexer nelas sem medir tende a derrubá-los:

- **Uma família só, servida pelo próprio domínio** (`next/font`), na versão variável: 4 arquivos e 68 KB. Vindas por `<link>` do Google Fonts, custavam 780 ms de bloqueio de renderização e o texto ficava trocando de fonte, o que levava o Speed Index a 18,7 s.
- **Nada acima da dobra depende de JavaScript para aparecer.** O hero usa `.enter-up` / `.enter-zoom`, animações CSS que rodam no carregamento e **não animam opacidade**. Quando o título estava dentro de um `<Reveal>`, ele esperava a hidratação e o LCP subia 1,2 s.
- **O catálogo renderiza no servidor.** `useSearchParams` obrigaria um `<Suspense>`, e o HTML estático entregaria só o "Carregando…", com a grade entrando depois (CLS 0,16 no desktop). O estado dos filtros vive no componente e a URL é um espelho dele.
- **Contraste verificado por cálculo**, não a olho. `--color-gold` passa em 3:1 (texto grande) e `--color-gold-deep` em 4,5:1 (rótulos pequenos) sobre os dois tons de fundo.
- **Alvos de toque de no mínimo 24 px** (WCAG 2.2). O utilitário `.tap` dá área clicável a links inline sem alterar o ritmo visual.
- **Deslocamento lateral dos reveals só a partir de 1024 px**, e menor que a folga do container. Abaixo disso a coluna ocupa a largura toda e empurrar na horizontal corta o texto na borda.

Verificado também numa matriz de 12 larguras (320 px a 1920 px) × 4 páginas: zero rolagem horizontal e zero elementos vazando da viewport.

## Página do imóvel

Alguns comportamentos dela não são óbvios pelo código:

- **O topo não depende de JavaScript.** A foto usa `animation-timeline: view()`, que liga a animação à rolagem no próprio CSS, sem listener de scroll e sem custo de main thread. Onde o navegador não suporta, a foto fica parada. O parallax exige a imagem maior que a moldura, então ela extrapola de propósito e o pai recorta.
- **O índice fixo** marca a seção atual com um `IntersectionObserver` de faixa estreita no meio da tela, para a marcação não piscar entre duas seções.
- **O visor da galeria** anda por seta, por arrasto e circula do fim para o começo; trava a rolagem do fundo, prende o Tab dentro dele e devolve o foco à miniatura de origem ao fechar.
- **O mapa só carrega quando o visitante clica.** Um iframe de mapa traz centenas de KB de terceiro; carregar sempre custaria o desempenho da página inteira por um recurso que a maioria não abre.
- **A barra fixa do rodapé** existe só no mobile, onde o preço e o botão de contato saem da tela nas primeiras rolagens e não voltam. Onde ela aparece, o botão flutuante de WhatsApp é escondido, senão ficariam dois no mesmo canto.

## Tipografia

**Plus Jakarta Sans** em todo o site, na versão variável. É geométrica como a Montserrat, mas com caixa-alta mais estreita, que é onde a Montserrat sofre: este site é cheio de rótulo pequeno em caixa-alta com tracking largo.

A Cormorant Garamond fazia os títulos e **saiu por um defeito concreto**: desenha o circunflexo de `ê` e `â` solto e alto demais, então "Residência" e "Goiânia", que aparecem em quase todo título, saíam com o acento descolado da letra. Não é o subconjunto de caracteres: testado com `latin-ext`, o desenho é o mesmo.

Sem serifa, a hierarquia passou a ser peso e tamanho:

- `.display` usa peso 300, entrelinha 1.06 e tracking `-0.022em`. O tracking negativo também encolhe o espaço entre palavras, e a `-0.03em` chegava a colar "ResidênciaMarista", então há um `word-spacing` compensando.
- `.display em` (o destaque dos títulos) virou **cor e peso**, não itálico: itálico sintético em geométrica fica frouxo.

## Animação de entrada

`components/Reveal.tsx` concentra a revelação ao rolar. Três peças:

- **`<Reveal variant="up|down|left|right|scale|clip">`**: um elemento.
- **`<RevealGroup step={90}>`**: escalona o atraso entre os filhos, que é o que faz uma grade parecer intencional em vez de piscar inteira.
- **`<ScrollProgress />`**: barra fina de progresso no topo.

Duas decisões que evitam as armadilhas conhecidas de bibliotecas como a AOS:

1. **O CSS que esconde vive dentro de `@media (prefers-reduced-motion: no-preference)`.** Se o JS não carregar, ou o usuário pedir menos movimento, o conteúdo já nasce visível, e a página nunca fica em branco.
2. **`overflow-x: clip` fica no `body`, não no `html`.** As variantes laterais deslocam o elemento para fora da viewport e criavam barra de rolagem horizontal no mobile. No `html`, porém, a contenção altera o cálculo do IntersectionObserver e os reveals param de disparar. Em telas estreitas as variantes laterais viram deslocamento vertical.

Os números do hero usam `<CountUp />`, que renderiza o valor final no servidor e só então anima. Sem JS, o número correto já está lá.

## Conteúdo editável

Todo texto do site sai do painel, em **`/admin/conteudo`**. São 19 blocos de copy e 12 listas.

A forma dos campos vive em **`lib/content-schema.ts`**, que também guarda o texto padrão. O banco grava só o que foi alterado, e a leitura mescla os dois. Três consequências práticas:

- O site **nunca fica sem texto**: um campo que ninguém tocou continua vindo do código.
- Acrescentar um campo é editar o schema. Ele aparece no painel com rótulo e ajuda, sem migração de dados e sem tocar no formulário.
- Uma **lista vazia no banco usa os padrões do código**. Na primeira vez que a lista é aberta no painel, esses padrões são copiados para o banco, senão editar um deles seria impossível. A partir daí o banco manda sozinho, para que apagar um item não traga o padrão de volta.

### Blocos e listas

| Grupo | Blocos | Listas |
| --- | --- | --- |
| Geral | Marca, Contato, Rodapé | Menu de navegação |
| Início | Topo, Comprar ou vender, Sobre, Portfólio, Bairros, Consultoria, Faixa para proprietários, Depoimentos, Boletim, Contato | Números do topo, Cartões comprar/vender, Pilares, Frentes de consultoria, Depoimentos, Opções de interesse |
| Imóveis | Topo do catálogo | |
| Vender | Topo, Por que conosco, Processo, Depoimento em destaque, Dúvidas | Benefícios, Argumentos com número, Etapas, Prazos, Perguntas frequentes |

Nas listas dá para acrescentar, editar, reordenar e remover itens. A ordem do painel é a ordem no site.

### Fotos

Cinco pontos do site têm foto trocável pelo painel, marcados com um ícone de câmera no hub:

| Onde | Seção no painel | Proporção |
| --- | --- | --- |
| Foto do consultor | Conteúdo → Sobre | 4:5, em pé |
| Faixa para proprietários | Conteúdo → Faixa para proprietários | deitada, 2000 px+ |
| Depoimento da página de venda | Conteúdo → Depoimento em destaque | deitada, 2000 px+ |
| Cartões comprar / vender | Listas → Cartões comprar / vender | 3:4, em pé |
| Frentes de consultoria | Listas → Frentes de consultoria | 3:2, deitada |

Cada campo traz a proporção esperada, porque o recorte é diferente em cada lugar: uma paisagem no lugar do retrato sai cortada nas laterais.

As fotos dos imóveis ficam no cadastro do imóvel, não aqui: são dado do imóvel, não conteúdo do site.

O upload vai do navegador direto para o Storage e o arquivo recebe um nome único, para dois envios com o mesmo nome de origem não se sobrescreverem.

### Topo em tela cheia

O topo da home ocupa a tela inteira, com o texto sobre a mídia. Dois campos em `Conteúdo → Topo` controlam o fundo:

- **Foto de fundo**: deitada, 1920 × 1080 ou maior. É ela que aparece primeiro e fica no lugar do vídeo enquanto ele carrega. Vazio, usa a foto do imóvel em destaque.
- **Vídeo em laço**: MP4 ou WebM até 60 MB, opcional.

**No celular a tela é em pé, e um vídeo 16:9 mostra só a faixa central**, medida em cerca de 31% da largura. O que importa precisa estar no meio do quadro. É limitação de proporção, não do código: encher uma tela em pé com material deitado exige cortar as laterais.

O escurecimento são dois véus e não um só: o vertical firma a base, onde ficam os números e a busca; o horizontal escurece apenas a faixa da esquerda, onde vive o texto. Escurecer o quadro inteiro o bastante para garantir leitura apagaria o vídeo.

A ordem em que as coisas entram na tela é o que preserva o desempenho:

1. A **foto é renderizada sempre**, com `priority`, e continua sendo o elemento de LCP. O vídeo nunca atrasa a primeira pintura.
2. O download do vídeo só começa **600 ms depois**, para não disputar banda com o que precisa aparecer primeiro.
3. O vídeo aparece por transição só quando dispara `canplay`. Se falhar, demorar, ou o navegador recusar o autoplay, o que fica na tela é a foto.
4. **Pausa quando o topo sai da tela.** Sem isso o laço roda enquanto o visitante lê o resto da página: no mobile isso levava o TBT de 100 ms para 370 ms, além do gasto de bateria.
5. Não carrega quando o sistema pede menos movimento (`prefers-reduced-motion`) ou a economia de dados está ligada.

Recomendação de arquivo: 8 a 15 segundos, sem áudio, cortado para emendar no laço. A moldura é vertical (4:5), então vídeo deitado é cortado nas laterais.

### Itálico dourado

Nos campos de título, um trecho entre asteriscos vira o itálico dourado: `Imóveis que representam o seu *próximo nível*`.

O texto vem do banco, então nada de HTML: `parseDestaque` quebra a frase em pedaços e só o trecho marcado recebe `<em>`. Marcação inventada sai como texto puro, o que fecha a porta para injeção de script pelo painel.

### Dados da marca

Nome, contato, CRECI e redes são lidos por quase todo componente de cliente. Em vez de encadear props por várias camadas até chegar numa folha, eles são servidos por contexto (`components/SiteContext.tsx`), preenchido no layout raiz.

## Painel de administração

O painel fica em **`/admin`** e permite cadastrar, editar, publicar/despublicar e excluir imóveis, com upload de fotos direto do navegador.

| Rota | O que faz |
| --- | --- |
| `/admin/login` | Entrada por e-mail e senha |
| `/admin/conteudo` | Todos os textos do site, por bloco |
| `/admin/listas/[lista]` | Listas com acrescentar, reordenar e remover |
| `/admin` | Lista tudo, inclusive rascunhos, com publicar/despublicar em um clique |
| `/admin/imoveis/novo` | Cadastro de imóvel |
| `/admin/imoveis/[id]` | Edição |

### Como os dados chegam ao site

Os imóveis vivem numa tabela Postgres no Supabase. As páginas públicas são estáticas (revalidação de 1h), mas **não é preciso esperar**: ao salvar no painel, a server action chama `revalidatePath` e a alteração aparece no site imediatamente.

O site público lê com um cliente anônimo sem cookies, de propósito: ler a sessão forçaria toda página a virar dinâmica.

### Segurança

- **RLS ligada** em `properties`. Anônimo só enxerga `published = true`.
- **Escrita exige allowlist.** A chave anônima é pública e qualquer um pode chamar `signUp`, então estar autenticado não basta: as policies checam `public.is_admin()`, que consulta a tabela `admins`. Quem não está nela não escreve nada, nem no banco nem no Storage.
- Para liberar outra pessoa, crie o usuário no Supabase (Authentication → Users) e insira o `user_id` dele em `public.admins`.

### Fotos

Vão para o bucket `imoveis` do Supabase Storage: leitura pública, escrita restrita à allowlist, limite de 10 MB por arquivo, aceitando JPEG, PNG, WebP e AVIF. O upload acontece do navegador direto para o Storage, então o binário não passa pelo servidor do Next.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` no desenvolvimento. **Na Vercel, adicione as duas em Settings → Environment Variables:**

| Variável | Obrigatória | Valor |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sim | Chave publicável (`sb_publishable_...`) |
| `NEXT_PUBLIC_SITE_URL` | não | Só com vários domínios no mesmo projeto, para fixar o canônico |

Ambas são públicas por natureza, e quem protege os dados é a RLS, não o segredo da chave. **Nunca coloque a `service_role` key no projeto**: ela ignora RLS por completo.

## Onde mexer

- **`components/Reveal.tsx`**: animação de entrada. **`components/PropertySpecs.tsx`**: linha de ícones dos cards.
- **`lib/properties.ts`**: tipos, rótulos e formatadores do domínio. Os imóveis em si ficam no banco, editados pelo painel.
- **`lib/queries.ts`**: leitura dos imóveis; `app/admin/actions.ts` concentra a escrita.
- **`app/globals.css`**: tokens de cor, tipografia e espaçamento.

## Pendências antes de publicar

Os pontos abaixo estão marcados com `TODO(cliente)` no código:

- [ ] **Contato real** no painel, em Conteúdo → Contato e Conteúdo → Marca: WhatsApp, e-mail, endereço e número do CRECI (hoje são placeholders).
- [ ] **Imóveis reais** com fotografia própria. Cadastre pelo painel em `/admin`. Os 6 imóveis atuais são de marcação, com fotos de banco público.
- [ ] **Foto do consultor** em `components/About.tsx`.
- [ ] **Depoimentos reais**, com autorização de uso do nome, em `components/Testimonials.tsx`.
- [ ] **Newsletter**: hoje o cadastro só confirma na tela e nada é gravado. Plugar num provedor (Resend, Brevo, RD Station) via server action.
- [ ] **Números do `/vender`** ("24 meses", "68 dias", "0 placas") e do hero ("R$ 380M", "12 anos", "240+"): confirmar se refletem a operação real antes de publicar.
- [ ] **Fontes**: hoje carregadas por `<link>` no `app/layout.tsx` porque o ambiente de build não tinha acesso ao Google Fonts. Em produção, trocar por `next/font/google` reduz o CLS.

## Captação de leads

Não há backend. Os formulários de contato e de avaliação montam uma mensagem estruturada e abrem o WhatsApp do consultor com tudo preenchido, então o lead cai no canal que a equipe já usa. Para registrar em CRM, trocar por uma server action que grave antes de redirecionar.
