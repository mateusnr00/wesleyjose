import { site } from "./site"

/**
 * URL base para metadata (Open Graph, sitemap, canonical).
 *
 * Enquanto o domínio próprio não estiver apontado, usar `site.url` faria as
 * imagens de Open Graph resolverem contra um domínio que ainda não existe.
 * A Vercel injeta VERCEL_PROJECT_PRODUCTION_URL no build, então preferimos ela
 * até que NEXT_PUBLIC_SITE_URL seja definida.
 */
export function baseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return site.url
}
