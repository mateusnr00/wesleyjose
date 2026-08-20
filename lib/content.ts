import "server-only"
import { createPublicClient } from "./supabase/public"
import { createClient } from "./supabase/server"
import {
  blockDefaults,
  blocks,
  collections,
  type BlockKey,
  type CollectionKey,
} from "./content-schema"

export type Blocks = Record<string, Record<string, string>>
export type Items = Record<string, ({ id: string } & Record<string, string>)[]>

export interface SiteContent {
  blocks: Blocks
  items: Items
}

/** Texto de um campo, já com o padrão do código aplicado. */
export function t(content: SiteContent, key: BlockKey, field: string): string {
  return content.blocks[key]?.[field] ?? ""
}

/** Itens de uma coleção, na ordem definida no painel. */
export function list(content: SiteContent, key: CollectionKey) {
  return content.items[key] ?? []
}

/**
 * Todo o conteúdo editável do site, numa consulta por tabela.
 *
 * Blocos: os padrões do código são a base, e o banco sobrescreve campo a
 * campo. Coleções: se a coleção não tem nenhuma linha no banco, valem os
 * padrões do código; a partir do primeiro item salvo, o banco manda sozinho,
 * senão apagar um item traria o padrão de volta.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const supabase = createPublicClient()

  const base: Blocks = {}
  for (const key of Object.keys(blocks) as BlockKey[]) base[key] = blockDefaults(key)

  const padroesDeItens: Items = {}
  for (const key of Object.keys(collections) as CollectionKey[]) {
    padroesDeItens[key] = collections[key].defaults.map((f, i) => ({ id: `padrao-${key}-${i}`, ...f }))
  }

  if (!supabase) return { blocks: base, items: padroesDeItens }

  const [blocosDb, itensDb] = await Promise.all([
    supabase.from("content_blocks").select("key, fields"),
    supabase.from("content_items").select("id, collection, sort_order, fields").order("sort_order").order("created_at"),
  ])

  if (blocosDb.error || itensDb.error) {
    console.error("Falha ao carregar conteúdo:", blocosDb.error?.message ?? itensDb.error?.message)
    return { blocks: base, items: padroesDeItens }
  }

  for (const linha of blocosDb.data ?? []) {
    const salvo = (linha.fields ?? {}) as Record<string, string>
    if (!base[linha.key]) continue
    for (const [campo, valor] of Object.entries(salvo)) {
      // String vazia é uma escolha do editor, não ausência: respeitamos.
      if (typeof valor === "string") base[linha.key][campo] = valor
    }
  }

  const doBanco: Items = {}
  for (const linha of itensDb.data ?? []) {
    const colecao = linha.collection
    if (!(colecao in collections)) continue
    ;(doBanco[colecao] ??= []).push({ id: String(linha.id), ...((linha.fields ?? {}) as Record<string, string>) })
  }

  const itens: Items = {}
  for (const key of Object.keys(collections) as CollectionKey[]) {
    itens[key] = doBanco[key]?.length ? doBanco[key] : padroesDeItens[key]
  }

  return { blocks: base, items: itens }
}

/** Itens de uma coleção para o painel, sempre direto do banco. */
export async function getCollectionForAdmin(key: CollectionKey) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("content_items")
    .select("id, sort_order, fields")
    .eq("collection", key)
    .order("sort_order")
    .order("created_at")

  if (error) {
    console.error("Falha ao carregar coleção:", error.message)
    return []
  }

  return (data ?? []).map((linha) => ({
    id: String(linha.id),
    sort_order: Number(linha.sort_order),
    fields: (linha.fields ?? {}) as Record<string, string>,
  }))
}

/** Dados da marca resolvidos, no formato que o contexto do site espera. */
export function siteData(content: SiteContent) {
  const marca = content.blocks.marca ?? {}
  const contato = content.blocks.contato ?? {}

  return {
    name: marca.name ?? "",
    tagline: marca.tagline ?? "",
    description: marca.description ?? "",
    founderName: marca.founderName ?? "",
    founderRole: marca.founderRole ?? "",
    creci: marca.creci ?? "",
    whatsapp: contato.whatsapp ?? "",
    whatsappDisplay: contato.whatsappDisplay ?? "",
    email: contato.email ?? "",
    street: contato.street ?? "",
    district: contato.district ?? "",
    city: contato.city ?? "",
    state: contato.state ?? "",
    hours: contato.hours ?? "",
    instagram: contato.instagram ?? "",
    instagramHandle: contato.instagramHandle ?? "",
    nav: (content.items.navegacao ?? []).map((i) => ({ label: i.label ?? "", href: i.href ?? "" })),
  }
}

export async function getBlockForAdmin(key: BlockKey): Promise<Record<string, string>> {
  const supabase = await createClient()
  const { data } = await supabase.from("content_blocks").select("fields").eq("key", key).maybeSingle()

  return { ...blockDefaults(key), ...((data?.fields ?? {}) as Record<string, string>) }
}
