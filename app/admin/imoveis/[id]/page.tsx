import Link from "next/link"
import { notFound } from "next/navigation"
import { updateProperty } from "@/app/admin/actions"
import { PropertyForm } from "@/components/admin/PropertyForm"
import { getPropertyById } from "@/lib/queries"

export const dynamic = "force-dynamic"
export const metadata = { title: "Editar imóvel" }

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getPropertyById(id)
  if (!property) notFound()

  // Prende o id na action para o formulário continuar recebendo (prev, formData).
  const action = updateProperty.bind(null, property.id)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin" className="text-[10px] uppercase tracking-[0.18em] text-muted hover:text-graphite">
          ← Voltar
        </Link>

        {property.published && (
          <Link
            href={`/imoveis/${property.slug}`}
            target="_blank"
            className="text-[10px] uppercase tracking-[0.18em] text-muted hover:text-graphite"
          >
            Ver no site ↗
          </Link>
        )}
      </div>

      <h1 className="display mt-6 text-3xl">{property.name}</h1>
      <p className="mt-2 text-[13px] text-muted">
        Ref. <span className="text-graphite">{property.reference}</span> ·{" "}
        {property.published ? "publicado no site" : "rascunho — não aparece no site"}
      </p>

      <PropertyForm action={action} property={property} submitLabel="Salvar alterações" />
    </>
  )
}
