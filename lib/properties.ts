/**
 * Tipos e formatadores do domínio de imóveis.
 *
 * Este arquivo é puro de propósito: é importado tanto por componentes de
 * cliente quanto de servidor. O acesso ao banco fica em `lib/queries.ts`,
 * que é server-only.
 */

export type Purpose = "venda" | "locacao"
export type PropertyKind = "residencia" | "cobertura" | "apartamento" | "lancamento" | "off-market"
export type PropertyStatus = "disponivel" | "exclusivo" | "vendido" | "lancamento"

export interface Property {
  id: string
  slug: string
  /** Código curto ditável por telefone, ex. "PR0142". */
  reference: string
  name: string
  district: string
  city: string
  purpose: Purpose
  kind: PropertyKind
  status: PropertyStatus
  /** Preço em reais. `null` para imóveis sob consulta (off-market). */
  price: number | null
  area: number
  bedrooms: number
  suites: number
  parking: number
  headline: string
  description: string
  features: string[]
  image: string | null
  gallery: string[]
  featured: boolean
  published: boolean
}

export const kindLabels: Record<PropertyKind, string> = {
  residencia: "Residência",
  cobertura: "Cobertura",
  apartamento: "Apartamento",
  lancamento: "Lançamento",
  "off-market": "Off-market",
}

export const statusLabels: Record<PropertyStatus, string> = {
  disponivel: "Disponível",
  exclusivo: "Exclusivo",
  vendido: "Vendido",
  lancamento: "Lançamento",
}

export const purposeLabels: Record<Purpose, string> = {
  venda: "Venda",
  locacao: "Locação",
}

/** Imagem exibida quando o imóvel ainda não tem foto cadastrada. */
export const placeholderImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="100%" height="100%" fill="#efe9de"/><text x="50%" y="50%" font-family="system-ui,sans-serif" font-size="42" fill="#b0a894" text-anchor="middle" dominant-baseline="middle">sem foto</text></svg>',
  )

/** Formata valores em reais; imóveis sem preço aparecem como "Sob consulta". */
export function formatPrice(price: number | null): string {
  if (price === null) return "Sob consulta"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price)
}

/** Bairros distintos de uma lista, em ordem alfabética, para alimentar filtros. */
export function districtsOf(list: Property[]): string[] {
  return [...new Set(list.map((p) => p.district))].sort((a, b) => a.localeCompare(b, "pt-BR"))
}

/** Gera um slug a partir do nome do imóvel, para a URL pública. */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}
