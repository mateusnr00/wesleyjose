import Link from "next/link"
import { blocks, collections, type BlockKey, type CollectionKey } from "@/lib/content-schema"

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
        Todo texto que aparece no site pode ser alterado aqui. As listas aceitam acrescentar, remover e reordenar
        itens. As mudanças aparecem no site assim que você salva.
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
                {blocosDoGrupo.map((key) => (
                  <li key={key}>
                    <Link
                      href={`/admin/conteudo/${key}`}
                      className="group flex h-full flex-col justify-between gap-4 border border-line bg-paper p-5 transition-colors hover:border-graphite/25"
                    >
                      <span className="display text-lg transition-colors group-hover:text-gold-deep">
                        {blocks[key].label}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-muted">
                        {blocks[key].fields.length} campos
                      </span>
                    </Link>
                  </li>
                ))}

                {listasDoGrupo.map((key) => (
                  <li key={key}>
                    <Link
                      href={`/admin/listas/${key}`}
                      className="group flex h-full flex-col justify-between gap-4 border border-line bg-paper p-5 transition-colors hover:border-graphite/25"
                    >
                      <span className="display text-lg transition-colors group-hover:text-gold-deep">
                        {collections[key].label}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">Lista</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
