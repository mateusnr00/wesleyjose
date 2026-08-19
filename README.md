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
