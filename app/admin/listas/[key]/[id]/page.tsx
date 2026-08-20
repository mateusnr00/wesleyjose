import Link from "next/link"
import { notFound } from "next/navigation"
import { updateItem } from "@/app/admin/content-actions"
import { ContentForm } from "@/components/admin/ContentForm"
import { collectionSchema, collections, type CollectionKey } from "@/lib/content-schema"
import { getCollectionForAdmin } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function EditItem({ params }: { params: Promise<{ key: string; id: string }> }) {
  const { key, id } = await params
  if (!(key in collections)) notFound()

  const chave = key as CollectionKey
  const esquema = collectionSchema(chave)
  const item = (await getCollectionForAdmin(chave)).find((i) => i.id === id)
  if (!item) notFound()

  const action = updateItem.bind(null, chave, id)

  return (
    <>
      <Link
        href={`/admin/listas/${chave}`}
        className="tap text-[10px] uppercase tracking-[0.18em] text-muted hover:text-graphite"
      >
        ← {esquema.label}
      </Link>

      <h1 className="display mt-6 text-3xl">{item.fields[esquema.titleField] || "Item"}</h1>

      <ContentForm
        action={action}
        fields={esquema.fields}
        values={item.fields}
        submitLabel="Salvar alterações"
        cancelHref={`/admin/listas/${chave}`}
      />
    </>
  )
}
