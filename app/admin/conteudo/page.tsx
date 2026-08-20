import Link from "next/link"
import {
  blockSchema,
  blocks,
  collectionSchema,
  collections,
  type BlockKey,
  type CollectionKey,
} from "@/lib/content-schema"

export const metadata = { title: "Conteúdo do site" }

export default function ContentHub() {
  const chavesBloco = Object.keys(blocks) as BlockKey[]
  const chavesLista = Object.keys(collections) as CollectionKey[]

  // Agrupa por seção do site, para o painel espelhar a ordem de navegação.
  const grupos = ["Geral", "Início", "Imóveis", "Vender"]

  return (
    <>
      <h1 className="display text-3xl">Conteúdo do site</h1>
      <p className="mt-2 max-w-2xl text-[13px] text-muted">
        Todo texto e toda foto do site podem ser alterados aqui. As listas aceitam acrescentar, remover e
        reordenar itens. As mudanças aparecem no site assim que você salva.
      </p>

      <div className="mt-12 space-y-14">
        {grupos.map((grupo) => {
          const blocosDoGrupo = chavesBloco.filter((k) => blocks[k].group === grupo)
          const listasDoGrupo = chavesLista.filter((k) => collections[k].group === grupo)
          if (!blocosDoGrupo.length && !listasDoGrupo.length) return null

          return (
            <section key={grupo}>
              <h2 className="border-b border-line pb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
                {grupo}
              </h2>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {blocosDoGrupo.map((key) => {
                  const bloco = blockSchema(key)
                  const fotos = bloco.fields.filter((f) => f.type === "image").length

                  return (
                    <li key={key}>
                      <Link
                        href={`/admin/conteudo/${key}`}
                        className="group flex h-full flex-col justify-between gap-4 border border-line bg-paper p-5 transition-colors hover:border-graphite/25"
                      >
                        <span className="display text-lg transition-colors group-hover:text-gold-deep">
                          {bloco.label}
                        </span>
                        <span className="flex flex-wrap items-center gap-x-2 text-[10px] uppercase tracking-[0.18em] text-muted">
                          {bloco.fields.length} campos
                          {fotos > 0 && (
                            <span className="inline-flex items-center gap-1.5 text-gold-deep">
                              <CameraIcon />
                              {fotos === 1 ? "1 foto" : `${fotos} fotos`}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  )
                })}

                {listasDoGrupo.map((key) => {
                  const lista = collectionSchema(key)
                  const temFoto = lista.fields.some((f) => f.type === "image")

                  return (
                    <li key={key}>
                      <Link
                        href={`/admin/listas/${key}`}
                        className="group flex h-full flex-col justify-between gap-4 border border-line bg-paper p-5 transition-colors hover:border-graphite/25"
                      >
                        <span className="display text-lg transition-colors group-hover:text-gold-deep">
                          {lista.label}
                        </span>
                        <span className="flex flex-wrap items-center gap-x-2 text-[10px] uppercase tracking-[0.18em] text-muted">
                          <span className="text-gold-deep">Lista</span>
                          {temFoto && (
                            <span className="inline-flex items-center gap-1.5">
                              <CameraIcon />
                              com foto
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 8.5A1.5 1.5 0 014.5 7h2.2l1-1.8a1 1 0 01.9-.5h4.8a1 1 0 01.9.5l1 1.8h2.2A1.5 1.5 0 0119 8.5v9a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 013 17.5v-9z" />
      <circle cx="11" cy="12.5" r="3.2" />
    </svg>
  )
}
