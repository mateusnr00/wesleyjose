/**
 * URL base para metadata (Open Graph, sitemap, canonical).
 *
 * Em produção a Vercel injeta VERCEL_PROJECT_PRODUCTION_URL com o domínio de
 * produção do projeto, então trocar de domínio não exige mexer no código nem
 * definir variável: basta vincular o domínio novo na Vercel e refazer o
 * deploy. Não há domínio fixo aqui de propósito, para não existir um endereço
 * que envelhece em silêncio e passa a aparecer no sitemap e nas tags de
 * compartilhamento.
 *
 * NEXT_PUBLIC_SITE_URL continua tendo prioridade e serve para o caso de vários
 * domínios apontarem para o mesmo projeto, quando é preciso escolher qual é o
 * canônico.
 */
export function baseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  // Deploy de preview: cada um tem a sua própria URL.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  return "http://localhost:3000"
}
