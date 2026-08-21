"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { slugify, type Property } from "@/lib/properties"

export type ActionResult = { error: string } | { ok: true }

/** Campos numéricos vazios viram null/0 em vez de NaN. */
function num(value: FormDataEntryValue | null): number {
  const parsed = Number(String(value ?? "").replace(/\./g, "").replace(",", "."))
  return Number.isFinite(parsed) ? parsed : 0
}

function optionalNum(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim()
  if (!raw) return null
  const parsed = Number(raw.replace(/\./g, "").replace(",", "."))
  return Number.isFinite(parsed) ? parsed : null
}

/** Uma feature por linha no textarea. */
function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function payloadFrom(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const slugInput = String(formData.get("slug") ?? "").trim()

  return {
    name,
    slug: slugInput ? slugify(slugInput) : slugify(name),
    district: String(formData.get("district") ?? "").trim(),
    city: String(formData.get("city") ?? "Goiânia").trim() || "Goiânia",
    // A restrição do banco exige duas maiúsculas; normalizar aqui evita que um
    // "go" digitado em minúscula derrube o salvamento inteiro.
    state: (String(formData.get("state") ?? "GO").trim().toUpperCase().slice(0, 2) || "GO").padEnd(2, "O"),
    purpose: String(formData.get("purpose") ?? "venda"),
    kind: String(formData.get("kind") ?? "residencia"),
    status: String(formData.get("status") ?? "disponivel"),
    // Vazio significa "sob consulta", que é diferente de zero.
    price: optionalNum(formData.get("price")),
    area: num(formData.get("area")),
    bedrooms: num(formData.get("bedrooms")),
    suites: num(formData.get("suites")),
    parking: num(formData.get("parking")),
    headline: String(formData.get("headline") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    features: lines(formData.get("features")),
    image: String(formData.get("image") ?? "").trim() || null,
    gallery: lines(formData.get("gallery")),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  }
}

/** Revalida tudo que mostra imóvel, para a mudança aparecer na hora no site. */
function revalidatePublicPages(slug?: string) {
  revalidatePath("/")
  revalidatePath("/imoveis")
  revalidatePath("/sitemap.xml")
  if (slug) revalidatePath(`/imoveis/${slug}`)
}

export async function createProperty(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const payload = payloadFrom(formData)

  if (!payload.name || !payload.district) {
    return { error: "Nome e bairro são obrigatórios." }
  }

  const { error } = await supabase.from("properties").insert(payload)

  if (error) {
    if (error.code === "23505") {
      return { error: "Já existe um imóvel com esse endereço de URL (slug). Escolha outro." }
    }
    return { error: `Não foi possível salvar: ${error.message}` }
  }

  revalidatePublicPages(payload.slug)
  revalidatePath("/admin")
  redirect("/admin?criado=1")
}

export async function updateProperty(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient()
  const payload = payloadFrom(formData)

  if (!payload.name || !payload.district) {
    return { error: "Nome e bairro são obrigatórios." }
  }

  // O slug antigo também precisa ser revalidado: se ele mudou, a página
  // anterior continuaria em cache apontando para um endereço morto.
  const { data: previous } = await supabase.from("properties").select("slug").eq("id", id).maybeSingle()

  const { error } = await supabase.from("properties").update(payload).eq("id", id)

  if (error) {
    if (error.code === "23505") {
      return { error: "Já existe um imóvel com esse endereço de URL (slug). Escolha outro." }
    }
    return { error: `Não foi possível salvar: ${error.message}` }
  }

  revalidatePublicPages(payload.slug)
  if (previous?.slug && previous.slug !== payload.slug) revalidatePublicPages(previous.slug)
  revalidatePath("/admin")
  redirect("/admin?salvo=1")
}

export async function deleteProperty(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const id = String(formData.get("id") ?? "")

  const { data: previous } = await supabase.from("properties").select("slug").eq("id", id).maybeSingle()
  const { error } = await supabase.from("properties").delete().eq("id", id)

  if (error) {
    console.error("Falha ao excluir imóvel:", error.message)
    redirect("/admin?erro=exclusao")
  }

  revalidatePublicPages(previous?.slug)
  revalidatePath("/admin")
  redirect("/admin?excluido=1")
}

/** Publica ou despublica sem abrir o formulário inteiro. */
export async function togglePublished(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const id = String(formData.get("id") ?? "")
  const next = formData.get("published") === "true"

  const { data, error } = await supabase
    .from("properties")
    .update({ published: next })
    .eq("id", id)
    .select("slug")
    .maybeSingle()

  if (error) {
    console.error("Falha ao alterar publicação:", error.message)
  }

  revalidatePublicPages(data?.slug)
  revalidatePath("/admin")
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

export type { Property }
