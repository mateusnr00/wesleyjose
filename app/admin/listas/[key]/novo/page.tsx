import Link from "next/link"
import { notFound } from "next/navigation"
import { createItem } from "@/app/admin/content-actions"
import { ContentForm } from "@/components/admin/ContentForm"
import { collectionSchema, collections, type CollectionKey } from "@/lib/content-schema"

export const dynamic = "force-dynamic"

export default async function NewItem({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  if (!(key in collections)) notFound()

  const chave = key as CollectionKey
  const esquema = collectionSchema(chave)
  const action = createItem.bind(null, chave)
  const vazios = Object.fromEntries(esquema.fields.map((f) => [f.name, ""]))

  return (
    <>
      <Link
        href={`/admin/listas/${chave}`}
        className="tap text-[10px] uppercase tracking-[0.18em] text-muted hover:text-graphite"
      >
        ← {esquema.label}
      </Link>

      <h1 className="display mt-6 text-3xl">Novo item</h1>
      <p className="mt-2 text-[13px] text-muted">Entra no fim da lista. A ordem pode ser mudada depois.</p>

      <ContentForm
        action={action}
        fields={esquema.fields}
        values={vazios}
        submitLabel="Adicionar"
        cancelHref={`/admin/listas/${chave}`}
      />
    </>
  )
}
