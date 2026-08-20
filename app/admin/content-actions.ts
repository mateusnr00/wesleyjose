"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { blocks, collections, type BlockKey, type CollectionKey } from "@/lib/content-schema"
import { createClient } from "@/lib/supabase/server"

export type ContentResult = { error: string } | { ok: true }

/**
 * Conteúdo aparece em todas as páginas, então uma edição invalida todas.
 * As páginas de imóvel não entram: nenhum bloco editável aparece nelas além
 * de cabeçalho e rodapé, que o layout revalida junto.
 */
function revalidarSite() {
  revalidatePath("/", "layout")
}

/** Lê do formulário apenas os campos que o schema declara. */
function camposDoFormulario(nomes: string[], formData: FormData): Record<string, string> {
  const saida: Record<string, string> = {}
  for (const nome of nomes) {
    const valor = formData.get(nome)
    if (typeof valor === "string") saida[nome] = valor.trim()
  }
  return saida
}

export async function saveBlock(
  key: BlockKey,
  _prev: ContentResult | null,
  formData: FormData,
): Promise<ContentResult> {
  if (!(key in blocks)) return { error: "Bloco desconhecido." }

  const supabase = await createClient()
  const fields = camposDoFormulario(
    blocks[key].fields.map((f) => f.name),
    formData,
  )

  const { error } = await supabase.from("content_blocks").upsert({ key, fields }, { onConflict: "key" })

  if (error) return { error: `Não foi possível salvar: ${error.message}` }

  revalidarSite()
  revalidatePath("/admin/conteudo")
  redirect(`/admin/conteudo/${key}?salvo=1`)
}

/**
 * Copia os padrões do código para o banco na primeira vez que a coleção é
 * aberta no painel. Sem isso, a lista abriria vazia mesmo com o site
 * exibindo os itens padrão, e editar um deles seria impossível.
 */
export async function ensureCollection(key: CollectionKey): Promise<void> {
  if (!(key in collections)) return

  const supabase = await createClient()

  // Buscar uma linha em vez de pedir contagem: `count` com `head` depende de
  // cabeçalho de resposta, e basta saber se existe algo.
  const { data, error } = await supabase
    .from("content_items")
    .select("id")
    .eq("collection", key)
    .limit(1)

  if (error || (data?.length ?? 0) > 0) return

  const linhas = collections[key].defaults.map((fields, i) => ({
    collection: key,
    sort_order: i,
    fields,
  }))

  await supabase.from("content_items").insert(linhas)
}

export async function createItem(
  key: CollectionKey,
  _prev: ContentResult | null,
  formData: FormData,
): Promise<ContentResult> {
  if (!(key in collections)) return { error: "Lista desconhecida." }

  const supabase = await createClient()
  const fields = camposDoFormulario(
    collections[key].fields.map((f) => f.name),
    formData,
  )

  // Entra no fim da lista.
  const { data: ultimo } = await supabase
    .from("content_items")
    .select("sort_order")
    .eq("collection", key)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase.from("content_items").insert({
    collection: key,
    sort_order: (ultimo?.sort_order ?? -1) + 1,
    fields,
  })

  if (error) return { error: `Não foi possível criar: ${error.message}` }

  revalidarSite()
  revalidatePath(`/admin/listas/${key}`)
  redirect(`/admin/listas/${key}?criado=1`)
}

export async function updateItem(
  key: CollectionKey,
  id: string,
  _prev: ContentResult | null,
  formData: FormData,
): Promise<ContentResult> {
  if (!(key in collections)) return { error: "Lista desconhecida." }

  const supabase = await createClient()
  const fields = camposDoFormulario(
    collections[key].fields.map((f) => f.name),
    formData,
  )

  const { error } = await supabase.from("content_items").update({ fields }).eq("id", id)

  if (error) return { error: `Não foi possível salvar: ${error.message}` }

  revalidarSite()
  revalidatePath(`/admin/listas/${key}`)
  redirect(`/admin/listas/${key}?salvo=1`)
}

export async function deleteItem(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const id = String(formData.get("id") ?? "")
  const key = String(formData.get("collection") ?? "")

  await supabase.from("content_items").delete().eq("id", id)

  revalidarSite()
  revalidatePath(`/admin/listas/${key}`)
  redirect(`/admin/listas/${key}?excluido=1`)
}

/**
 * Troca a posição do item com a do vizinho.
 *
 * Trocar os dois valores, em vez de renumerar a lista toda, mantém a operação
 * em duas linhas e não conflita com outra edição em andamento.
 */
export async function moveItem(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const id = String(formData.get("id") ?? "")
  const key = String(formData.get("collection") ?? "")
  const paraCima = formData.get("direcao") === "cima"

  const { data: itens } = await supabase
    .from("content_items")
    .select("id, sort_order")
    .eq("collection", key)
    .order("sort_order")
    .order("created_at")

  if (!itens?.length) return

  const indice = itens.findIndex((i) => String(i.id) === id)
  const vizinho = paraCima ? indice - 1 : indice + 1
  if (indice < 0 || vizinho < 0 || vizinho >= itens.length) return

  // A ordem pode ter valores repetidos vindos do seed; reindexar aqui garante
  // que a troca sempre tenha efeito.
  const nova = [...itens]
  ;[nova[indice], nova[vizinho]] = [nova[vizinho], nova[indice]]

  await Promise.all(
    nova.map((item, i) => supabase.from("content_items").update({ sort_order: i }).eq("id", item.id)),
  )

  revalidarSite()
  revalidatePath(`/admin/listas/${key}`)
}
