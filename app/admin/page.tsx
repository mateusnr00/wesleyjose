import Image from "next/image"
import Link from "next/link"
import { deleteProperty, togglePublished } from "./actions"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { getAllPropertiesForAdmin } from "@/lib/queries"
import { formatPrice, kindLabels, placeholderImage, statusLabels } from "@/lib/properties"

export const dynamic = "force-dynamic"

const flashes: Record<string, string> = {
  criado: "Imóvel criado e publicado no site.",
  salvo: "Alterações salvas.",
  excluido: "Imóvel excluído.",
}

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const properties = await getAllPropertiesForAdmin()
  const publishedCount = properties.filter((p) => p.published).length

  const flashKey = Object.keys(flashes).find((key) => params[key])
  const failed = params.erro === "exclusao"

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="display text-3xl">Imóveis</h1>
          <p className="mt-2 text-[13px] text-muted">
            {properties.length} {properties.length === 1 ? "cadastrado" : "cadastrados"} ·{" "}
            {publishedCount} {publishedCount === 1 ? "publicado" : "publicados"} no site
          </p>
        </div>

        <Link
          href="/admin/imoveis/novo"
          className="bg-graphite px-7 py-3.5 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold"
        >
          + Novo imóvel
        </Link>
      </div>

      {flashKey && (
        <p role="status" className="mt-8 border-l-2 border-gold bg-cream-deep/60 px-5 py-3 text-[13px]">
          {flashes[flashKey]}
        </p>
      )}

      {failed && (
        <p role="alert" className="mt-8 border-l-2 border-red-700 bg-red-50 px-5 py-3 text-[13px] text-red-800">
          Não foi possível excluir o imóvel. Tente novamente.
        </p>
      )}

      {properties.length === 0 ? (
        <div className="mt-12 border border-line px-8 py-20 text-center">
          <p className="display text-2xl">Nenhum imóvel cadastrado.</p>
          <p className="mx-auto mt-3 max-w-sm text-[13px] text-muted">
            Cadastre o primeiro e ele aparece no site imediatamente.
          </p>
          <Link
            href="/admin/imoveis/novo"
            className="mt-8 inline-block bg-graphite px-8 py-3.5 text-[10px] uppercase tracking-[0.2em] text-cream"
          >
            Cadastrar imóvel
          </Link>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {properties.map((property) => (
            <li key={property.id} className="grid gap-5 py-5 sm:grid-cols-[5rem_1fr_auto] sm:items-center">
              <div className="relative aspect-[4/3] w-20 overflow-hidden bg-cream-deep">
                <Image
                  src={property.image || placeholderImage}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized={!property.image}
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Link href={`/admin/imoveis/${property.id}`} className="display text-lg hover:text-gold">
                    {property.name}
                  </Link>

                  {property.published ? (
                    <span className="text-[9px] uppercase tracking-[0.16em] text-gold">No site</span>
                  ) : (
                    <span className="text-[9px] uppercase tracking-[0.16em] text-muted-light">Rascunho</span>
                  )}

                  {property.featured && (
                    <span className="text-[9px] uppercase tracking-[0.16em] text-muted">Destaque</span>
                  )}
                </div>

                <p className="mt-1 truncate text-[11px] uppercase tracking-[0.14em] text-muted">
                  {kindLabels[property.kind]} · {property.district} · {statusLabels[property.status]}
                </p>
                <p className="mt-1 text-[13px]">
                  {formatPrice(property.price)} · {property.area} m²
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <form action={togglePublished}>
                  <input type="hidden" name="id" value={property.id} />
                  <input type="hidden" name="published" value={String(!property.published)} />
                  <button
                    type="submit"
                    className="text-[10px] uppercase tracking-[0.18em] text-muted underline underline-offset-4 transition-colors hover:text-graphite"
                  >
                    {property.published ? "Despublicar" : "Publicar"}
                  </button>
                </form>

                <Link
                  href={`/admin/imoveis/${property.id}`}
                  className="border border-graphite/25 px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] transition-colors hover:border-graphite"
                >
                  Editar
                </Link>

                <form action={deleteProperty}>
                  <input type="hidden" name="id" value={property.id} />
                  <DeleteButton name={property.name} />
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
