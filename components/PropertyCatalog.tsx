"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { PropertyCard } from "./PropertyCard"
import { RevealGroup } from "./Reveal"
import {
  districtsOf,
  kindLabels,
  type Property,
  type PropertyKind,
} from "@/lib/properties"

const priceBands = [
  { value: "", label: "Qualquer valor" },
  { value: "0-3000000", label: "Até R$ 3 mi" },
  { value: "3000000-5000000", label: "R$ 3 a 5 mi" },
  { value: "5000000-8000000", label: "R$ 5 a 8 mi" },
  { value: "8000000-", label: "Acima de R$ 8 mi" },
]

const sortOptions = [
  { value: "relevancia", label: "Relevância" },
  { value: "maior-preco", label: "Maior valor" },
  { value: "menor-preco", label: "Menor valor" },
  { value: "maior-area", label: "Maior área" },
]

/** Faz o parse de "min-max" vindo da URL. Campos vazios viram limites abertos. */
function parseBand(band: string): [number, number] {
  const [min, max] = band.split("-")
  return [Number(min) || 0, Number(max) || Number.POSITIVE_INFINITY]
}

export function PropertyCatalog({ properties }: { properties: Property[] }) {
  const router = useRouter()
  const params = useSearchParams()

  const kind = params.get("tipo") ?? ""
  const district = params.get("bairro") ?? ""
  const band = params.get("preco") ?? ""
  const bedrooms = params.get("quartos") ?? ""
  const sort = params.get("ordem") ?? "relevancia"

  const hasFilters = Boolean(kind || district || band || bedrooms)

  /** Reescreve a query preservando os demais filtros — a URL fica compartilhável. */
  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.replace(`/imoveis${next.size ? `?${next}` : ""}`, { scroll: false })
  }

  const PER_PAGE = 9
  const [page, setPage] = useState(1)

  const results = useMemo(() => {
    const [min, max] = parseBand(band)

    const filtered = properties.filter((property) => {
      if (kind && property.kind !== kind) return false
      if (district && property.district !== district) return false
      if (bedrooms && property.bedrooms < Number(bedrooms)) return false

      // Imóveis sob consulta ficam de fora quando há filtro de faixa de valor,
      // já que não há preço para comparar.
      if (band) {
        if (property.price === null) return false
        if (property.price < min || property.price > max) return false
      }

      return true
    })

    const ordered = [...filtered]
    switch (sort) {
      case "maior-preco":
        ordered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
        break
      case "menor-preco":
        ordered.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
        break
      case "maior-area":
        ordered.sort((a, b) => b.area - a.area)
        break
    }

    return ordered
  }, [properties, kind, district, band, bedrooms, sort])

  // Trocar de filtro deve voltar para a primeira página; ficar na página 3 de
  // um resultado que agora tem 4 itens mostraria uma lista vazia.
  useEffect(() => {
    setPage(1)
  }, [kind, district, band, bedrooms, sort])

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE))
  const visible = results.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function goTo(next: number) {
    setPage(next)
    document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const selectClass =
    "w-full appearance-none border border-line bg-transparent px-4 py-3 text-[12px] outline-none transition-colors focus:border-gold"

  return (
    <>
      {/* Barra de filtros */}
      <div className="grid gap-4 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-5">
        <Filter label="Tipo">
          <select value={kind} onChange={(e) => setParam("tipo", e.target.value)} className={selectClass}>
            <option value="">Todos</option>
            {(Object.keys(kindLabels) as PropertyKind[]).map((k) => (
              <option key={k} value={k}>
                {kindLabels[k]}
              </option>
            ))}
          </select>
        </Filter>

        <Filter label="Bairro">
          <select value={district} onChange={(e) => setParam("bairro", e.target.value)} className={selectClass}>
            <option value="">Todos</option>
            {districtsOf(properties).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Filter>

        <Filter label="Valor">
          <select value={band} onChange={(e) => setParam("preco", e.target.value)} className={selectClass}>
            {priceBands.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Filter>

        <Filter label="Quartos (mínimo)">
          <select value={bedrooms} onChange={(e) => setParam("quartos", e.target.value)} className={selectClass}>
            <option value="">Indiferente</option>
            {[2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </Filter>

        <Filter label="Ordenar por">
          <select value={sort} onChange={(e) => setParam("ordem", e.target.value)} className={selectClass}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Filter>
      </div>

      <div id="resultados" className="mt-8 flex flex-wrap items-center justify-between gap-4 scroll-mt-32">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={() => router.replace("/imoveis", { scroll: false })}
            className="text-[11px] uppercase tracking-[0.18em] text-muted underline underline-offset-4 transition-colors hover:text-graphite"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <>
          <div className="mt-12 grid items-stretch gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {/* `key` na página força o reveal a rodar de novo a cada troca. */}
            <RevealGroup key={`${page}-${kind}-${district}-${band}-${bedrooms}-${sort}`} variant="up" step={70}>
              {visible.map((property, index) => (
                <PropertyCard key={property.slug} property={property} priority={page === 1 && index < 3} />
              ))}
            </RevealGroup>
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Paginação dos resultados"
              className="mt-16 flex items-center justify-between border-t border-line pt-8"
            >
              <button
                type="button"
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                className="text-[10px] uppercase tracking-[0.2em] text-muted transition-colors enabled:hover:text-graphite disabled:opacity-30"
              >
                ← Anterior
              </button>

              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                Página {page} de {totalPages}
              </span>

              <button
                type="button"
                onClick={() => goTo(page + 1)}
                disabled={page === totalPages}
                className="text-[10px] uppercase tracking-[0.2em] text-muted transition-colors enabled:hover:text-graphite disabled:opacity-30"
              >
                Próxima →
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="mt-16 border border-line px-8 py-20 text-center">
          <p className="display text-2xl">Nenhum imóvel com esses critérios.</p>
          <p className="mx-auto mt-4 max-w-sm text-[13px] text-muted">
            Boa parte do nosso estoque é off-market e não aparece no catálogo. Conte o que você procura
            e verificamos o que temos em carteira.
          </p>
          <button
            type="button"
            onClick={() => router.replace("/imoveis", { scroll: false })}
            className="mt-8 border border-graphite/25 px-8 py-3.5 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-graphite"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </>
  )
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-muted">{label}</span>
      {children}
    </label>
  )
}
