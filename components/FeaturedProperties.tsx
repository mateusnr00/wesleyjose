import Link from "next/link"
import { PropertyCard } from "./PropertyCard"
import { Destaque } from "./Destaque"
import { Reveal, RevealGroup } from "./Reveal"
import type { Property } from "@/lib/properties"

export function FeaturedProperties({ block, properties }: { block: Record<string, string>; properties: Property[] }) {

  return (
    <section id="imoveis" className="bg-cream-deep/60 py-section">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end">
            <div>
              <p className="eyebrow">{block.eyebrow}</p>
              <h2 className="display mt-7 max-w-md text-[2.25rem] lg:text-[3rem]">
                <Destaque>{block.title}</Destaque>
              </h2>
            </div>
            <p className="text-muted lg:pb-3">
{block.text}
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid items-stretch gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          <RevealGroup variant="up" step={90}>
            {properties.map((property, index) => (
              <PropertyCard key={property.slug} property={property} priority={index < 3} />
            ))}
          </RevealGroup>
        </div>

        <Reveal>
          <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[13px] text-muted">
{block.footnote}
            </p>
            <Link
              href="/imoveis"
              className="group inline-flex shrink-0 items-center gap-3 border-b border-graphite/25 pb-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-deep"
            >
              {block.linkLabel}
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
