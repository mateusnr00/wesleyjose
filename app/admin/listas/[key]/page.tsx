import Link from "next/link"
import { notFound } from "next/navigation"
import { deleteItem, ensureCollection, moveItem } from "@/app/admin/content-actions"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { collectionSchema, collections, type CollectionKey } from "@/lib/content-schema"
import { getCollectionForAdmin } from "@/lib/content"

export const dynamic = "force-dynamic"

const avisos: Record<string, string> = {
  criado: "Item adicionado e publicado no site.",
  salvo: "Alterações salvas.",
  excluido: "Item removido.",
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  const c = collections[key as CollectionKey]
  return { title: c ? c.label : "Lista" }
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { key } = await params
  const busca = await searchParams
  if (!(key in collections)) notFound()

  const chave = key as CollectionKey
  const esquema = collectionSchema(chave)

  // Primeira visita: traz os padrões do código para o banco, senão a lista
  // abriria vazia enquanto o site exibe os itens padrão.
  await ensureCollection(chave)
  const itens = await getCollectionForAdmin(chave)
  const aviso = Object.keys(avisos).find((k) => busca[k])

  return (
    <>
      <Link href="/admin/conteudo" className="tap text-[10px] uppercase tracking-[0.18em] text-muted hover:text-graphite">
        ← Conteúdo do site
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="display text-3xl">{esquema.label}</h1>
          <p className="mt-2 max-w-xl text-[13px] text-muted">
            {esquema.help ? `${esquema.help} ` : ""}
            {itens.length} {itens.length === 1 ? "item" : "itens"}.
          </p>
        </div>

        <Link
          href={`/admin/listas/${chave}/novo`}
          className="bg-graphite px-7 py-3.5 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold"
        >
          + Adicionar item
        </Link>
      </div>

      {aviso && (
        <p role="status" className="mt-8 border-l-2 border-gold bg-cream-deep/60 px-5 py-3 text-[13px]">
          {avisos[aviso]}
        </p>
      )}

      {itens.length === 0 ? (
        <div className="mt-12 border border-line px-8 py-16 text-center">
          <p className="display text-2xl">Nenhum item nesta lista.</p>
          <p className="mx-auto mt-3 max-w-sm text-[13px] text-muted">
            Enquanto estiver vazia, esta seção não aparece no site.
          </p>
        </div>
      ) : (
        <ol className="mt-10 divide-y divide-line border-y border-line">
          {itens.map((item, i) => (
            <li key={item.id} className="grid gap-4 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <div className="flex items-center gap-1">
                <span className="w-7 text-[10px] tracking-[0.2em] text-muted-light">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <form action={moveItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="collection" value={chave} />
                  <input type="hidden" name="direcao" value="cima" />
                  <button
                    type="submit"
                    disabled={i === 0}
                    aria-label="Mover para cima"
                    className="grid size-8 place-items-center text-muted transition-colors enabled:hover:text-graphite disabled:opacity-25"
                  >
                    ↑
                  </button>
                </form>

                <form action={moveItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="collection" value={chave} />
                  <input type="hidden" name="direcao" value="baixo" />
                  <button
                    type="submit"
                    disabled={i === itens.length - 1}
                    aria-label="Mover para baixo"
                    className="grid size-8 place-items-center text-muted transition-colors enabled:hover:text-graphite disabled:opacity-25"
                  >
                    ↓
                  </button>
                </form>
              </div>

              <div className="min-w-0">
                <Link
                  href={`/admin/listas/${chave}/${item.id}`}
                  className="display block truncate text-lg hover:text-gold-deep"
                >
                  {item.fields[esquema.titleField] || "(sem título)"}
                </Link>
                {esquema.fields.length > 1 && (
                  <p className="mt-1 truncate text-[12px] text-muted">
                    {esquema.fields
                      .filter((f) => f.name !== esquema.titleField && f.type !== "image")
                      .map((f) => item.fields[f.name])
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/listas/${chave}/${item.id}`}
                  className="border border-graphite/25 px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] transition-colors hover:border-graphite"
                >
                  Editar
                </Link>

                <form action={deleteItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="collection" value={chave} />
                  <DeleteButton name={item.fields[esquema.titleField] || "este item"} />
                </form>
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  )
}
