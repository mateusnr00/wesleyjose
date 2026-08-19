import Link from "next/link"
import { PropertyCard } from "./PropertyCard"
import { Reveal } from "./Reveal"
import type { Property } from "@/lib/properties"

export function FeaturedProperties({ properties }: { properties: Property[] }) {

  return (
    <section id="imoveis" className="bg-cream-deep/60 py-section">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end">
            <div>
              <p className="eyebrow">Portfólio atual</p>
              <h2 className="display mt-7 max-w-md text-[2.25rem] lg:text-[3rem]">
                Seleção de imóveis com <em>história</em> e proporção.
              </h2>
            </div>
            <p className="text-muted lg:pb-3">
              Cada imóvel abaixo passou por uma verificação de matrícula, projeto aprovado e histórico de
              valorização do endereço. O que não passa, não entra.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, index) => (
            <Reveal key={property.slug} delay={(index % 3) * 100}>
              <PropertyCard property={property} priority={index < 3} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[13px] text-muted">
              Procura algo que não está listado? Boa parte do nosso estoque é off-market e não aparece aqui.
            </p>
            <Link
              href="/imoveis"
              className="group inline-flex shrink-0 items-center gap-3 border-b border-graphite/25 pb-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold"
            >
              Ver o catálogo completo
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
