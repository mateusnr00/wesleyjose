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
| `/` | Home: hero com busca, sobre, portfólio, consultoria, captação de vendedores, depoimentos, newsletter, contato |
| `/imoveis` | Catálogo com filtros por tipo, bairro, faixa de valor e quartos, mais ordenação. Os filtros vivem na URL, então cada combinação é um link compartilhável |
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

## Onde mexer

- **`lib/site.ts`** — marca, contato, WhatsApp, CRECI, redes e números de prova social. Alterar aqui reflete em todo o site (header, footer, metadata, mensagens de WhatsApp).
- **`lib/properties.ts`** — catálogo de imóveis. Cada item alimenta os cards, os filtros e a página de detalhe.
- **`app/globals.css`** — tokens de cor, tipografia e espaçamento.

## Pendências antes de publicar

Os pontos abaixo estão marcados com `TODO(cliente)` no código:

- [ ] **Contato real** em `lib/site.ts`: WhatsApp, e-mail, endereço e número do CRECI (hoje são placeholders).
- [ ] **Imóveis reais** em `lib/properties.ts` com fotografia própria — as imagens atuais são de banco público e servem só para marcar o layout.
- [ ] **Foto do consultor** em `components/About.tsx`.
- [ ] **Depoimentos reais**, com autorização de uso do nome, em `components/Testimonials.tsx`.
- [ ] **Newsletter**: hoje o cadastro só confirma na tela e nada é gravado. Plugar num provedor (Resend, Brevo, RD Station) via server action.
- [ ] **Números do `/vender`** ("24 meses", "68 dias", "0 placas") e do hero ("R$ 380M", "12 anos", "240+"): confirmar se refletem a operação real antes de publicar.
- [ ] **Fontes**: hoje carregadas por `<link>` no `app/layout.tsx` porque o ambiente de build não tinha acesso ao Google Fonts. Em produção, trocar por `next/font/google` reduz o CLS.

## Captação de leads

Não há backend. Os formulários de contato e de avaliação montam uma mensagem estruturada e abrem o WhatsApp do consultor com tudo preenchido — o lead cai no canal que a equipe já usa. Para registrar em CRM, trocar por uma server action que grave antes de redirecionar.
