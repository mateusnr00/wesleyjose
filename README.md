# Premium Imóveis

Site institucional e de captação da **Premium Imóveis** — consultoria imobiliária de alto padrão em Goiânia ([@premiumimoveisgo](https://www.instagram.com/premiumimoveisgo/)).

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
| `/imoveis/[slug]` | Página do imóvel: galeria, ficha técnica, diferenciais e painel de contato fixo |
| `/vender` | Funil de proprietários: avaliação gratuita em formulário de 3 etapas, argumentos, processo em 4 passos e FAQ |

## Deploy na Vercel

O projeto é um Next.js padrão, detectado automaticamente pela Vercel — não precisa de `vercel.json` nem de configuração de build.

**Para ligar o deploy automático:**

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe `mateusnr00/wesleyjose`
3. Deixe as configurações como vieram (framework Next.js, build `next build`) e clique em **Deploy**

A partir daí, todo push no branch padrão vira deploy de produção, e todo branch novo ganha uma URL de preview.

### Detalhes que importam

- **Branch de produção**: hoje o branch padrão do repositório é `claude/website-inspiration-improvements-ge6ecl`, porque foi o primeiro a existir. A Vercel usa o branch padrão como produção. Se preferir um nome convencional, crie um `main` a partir dele e troque o padrão em Settings → Branches no GitHub **antes** de importar.
- **URL do site**: enquanto não houver domínio próprio, as tags de Open Graph e o `sitemap.xml` usam automaticamente a URL da Vercel (via `VERCEL_PROJECT_PRODUCTION_URL`). Quando apontar o domínio, defina `NEXT_PUBLIC_SITE_URL=https://seudominio.com.br` nas variáveis de ambiente do projeto e tudo passa a apontar para ele.
- **Imagens**: `images.unsplash.com` está liberado no `next.config.mjs`. Ao trocar pelas fotos reais, ajuste `remotePatterns` para o domínio de onde elas vierem — ou coloque os arquivos em `public/` e use caminhos locais.

## Animação de entrada

`components/Reveal.tsx` concentra a revelação ao rolar. Três peças:

- **`<Reveal variant="up|down|left|right|scale|clip">`** — um elemento.
- **`<RevealGroup step={90}>`** — escalona o atraso entre os filhos, que é o que faz uma grade parecer intencional em vez de piscar inteira.
- **`<ScrollProgress />`** — barra fina de progresso no topo.

Duas decisões que evitam as armadilhas conhecidas de bibliotecas como a AOS:

1. **O CSS que esconde vive dentro de `@media (prefers-reduced-motion: no-preference)`.** Se o JS não carregar, ou o usuário pedir menos movimento, o conteúdo já nasce visível — a página nunca fica em branco.
2. **`overflow-x: clip` fica no `body`, não no `html`.** As variantes laterais deslocam o elemento para fora da viewport e criavam barra de rolagem horizontal no mobile. No `html`, porém, a contenção altera o cálculo do IntersectionObserver e os reveals param de disparar. Em telas estreitas as variantes laterais viram deslocamento vertical.

Os números do hero usam `<CountUp />`, que renderiza o valor final no servidor e só então anima — sem JS, o número correto já está lá.

## Painel de administração

O painel fica em **`/admin`** e permite cadastrar, editar, publicar/despublicar e excluir imóveis, com upload de fotos direto do navegador.

| Rota | O que faz |
| --- | --- |
| `/admin/login` | Entrada por e-mail e senha |
| `/admin` | Lista tudo, inclusive rascunhos, com publicar/despublicar em um clique |
| `/admin/imoveis/novo` | Cadastro de imóvel |
| `/admin/imoveis/[id]` | Edição |

### Como os dados chegam ao site

Os imóveis vivem numa tabela Postgres no Supabase. As páginas públicas são estáticas (revalidação de 1h), mas **não é preciso esperar**: ao salvar no painel, a server action chama `revalidatePath` e a alteração aparece no site imediatamente.

O site público lê com um cliente anônimo sem cookies, de propósito — ler a sessão forçaria toda página a virar dinâmica.

### Segurança

- **RLS ligada** em `properties`. Anônimo só enxerga `published = true`.
- **Escrita exige allowlist.** A chave anônima é pública e qualquer um pode chamar `signUp`, então estar autenticado não basta: as policies checam `public.is_admin()`, que consulta a tabela `admins`. Quem não está nela não escreve nada, nem no banco nem no Storage.
- Para liberar outra pessoa, crie o usuário no Supabase (Authentication → Users) e insira o `user_id` dele em `public.admins`.

### Fotos

Vão para o bucket `imoveis` do Supabase Storage: leitura pública, escrita restrita à allowlist, limite de 10 MB por arquivo, aceitando JPEG, PNG, WebP e AVIF. O upload acontece do navegador direto para o Storage — o binário não passa pelo servidor do Next.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` no desenvolvimento. **Na Vercel, adicione as duas em Settings → Environment Variables:**

| Variável | Valor |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave publicável (`sb_publishable_...`) |

Ambas são públicas por natureza — quem protege os dados é a RLS, não o segredo da chave. **Nunca coloque a `service_role` key no projeto**: ela ignora RLS por completo.

## Onde mexer

- **`lib/site.ts`** — marca, contato, WhatsApp, CRECI, redes e números de prova social. Alterar aqui reflete em todo o site (header, footer, metadata, mensagens de WhatsApp).
- **`components/Reveal.tsx`** — animação de entrada; `components/PropertySpecs.tsx` — linha de ícones dos cards.
- **`lib/properties.ts`** — tipos, rótulos e formatadores do domínio. Os imóveis em si ficam no banco, editados pelo painel.
- **`lib/queries.ts`** — leitura dos imóveis; `app/admin/actions.ts` concentra a escrita.
- **`app/globals.css`** — tokens de cor, tipografia e espaçamento.

## Pendências antes de publicar

Os pontos abaixo estão marcados com `TODO(cliente)` no código:

- [ ] **Contato real** em `lib/site.ts`: WhatsApp, e-mail, endereço e número do CRECI (hoje são placeholders).
- [ ] **Imóveis reais** com fotografia própria — cadastre pelo painel em `/admin`. Os 6 imóveis atuais são de marcação, com fotos de banco público.
- [ ] **Foto do consultor** em `components/About.tsx`.
- [ ] **Depoimentos reais**, com autorização de uso do nome, em `components/Testimonials.tsx`.
- [ ] **Newsletter**: hoje o cadastro só confirma na tela e nada é gravado. Plugar num provedor (Resend, Brevo, RD Station) via server action.
- [ ] **Números do `/vender`** ("24 meses", "68 dias", "0 placas") e do hero ("R$ 380M", "12 anos", "240+"): confirmar se refletem a operação real antes de publicar.
- [ ] **Fontes**: hoje carregadas por `<link>` no `app/layout.tsx` porque o ambiente de build não tinha acesso ao Google Fonts. Em produção, trocar por `next/font/google` reduz o CLS.

## Captação de leads

Não há backend. Os formulários de contato e de avaliação montam uma mensagem estruturada e abrem o WhatsApp do consultor com tudo preenchido — o lead cai no canal que a equipe já usa. Para registrar em CRM, trocar por uma server action que grave antes de redirecionar.
