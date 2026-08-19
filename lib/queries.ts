import "server-only"
import { createClient } from "./supabase/server"
import { createPublicClient } from "./supabase/public"
import type { Property } from "./properties"

/** Colunas lidas pelo site público. Explícito para não vazar coluna nova sem querer. */
const COLUMNS =
  "id, slug, name, district, city, purpose, kind, status, price, area, bedrooms, suites, parking, headline, description, features, image, gallery, featured, published"

type Row = Record<string, unknown>

/** Normaliza a linha do Postgres para o tipo do domínio. */
function toProperty(row: Row): Property {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    district: String(row.district),
    city: String(row.city),
    purpose: row.purpose as Property["purpose"],
    kind: row.kind as Property["kind"],
    status: row.status as Property["status"],
    // `price` chega como string quando a coluna é numeric.
    price: row.price === null || row.price === undefined ? null : Number(row.price),
    area: Number(row.area),
    bedrooms: Number(row.bedrooms),
    suites: Number(row.suites),
    parking: Number(row.parking),
    headline: String(row.headline ?? ""),
    description: String(row.description ?? ""),
    features: (row.features as string[]) ?? [],
    image: (row.image as string | null) ?? null,
    gallery: (row.gallery as string[]) ?? [],
    featured: Boolean(row.featured),
    published: Boolean(row.published),
  }
}

/** Imóveis visíveis no site. A RLS anônima já restringe a `published = true`. */
export async function getProperties(): Promise<Property[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("properties")
    .select(COLUMNS)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Falha ao carregar imóveis:", error.message)
    return []
  }

  return (data ?? []).map(toProperty)
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const all = await getProperties()
  const featured = all.filter((p) => p.featured)
  // Se ninguém marcou destaque, mostrar os mais recentes é melhor que uma home vazia.
  return (featured.length > 0 ? featured : all).slice(0, limit)
}

export async function getProperty(slug: string): Promise<Property | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from("properties")
    .select(COLUMNS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle()

  if (error || !data) return null
  return toProperty(data)
}

/** Todos os imóveis, incluindo rascunhos. Só o painel usa. */
export async function getAllPropertiesForAdmin(): Promise<Property[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("properties")
    .select(COLUMNS)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Falha ao carregar imóveis do painel:", error.message)
    return []
  }

  return (data ?? []).map(toProperty)
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("properties").select(COLUMNS).eq("id", id).maybeSingle()

  if (error || !data) return null
  return toProperty(data)
}
