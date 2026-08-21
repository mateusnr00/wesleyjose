import Image from "next/image"
import Link from "next/link"
import { PropertySpecs } from "./PropertySpecs"
import { formatPrice, kindLabels, placeholderImage, statusLabels, type Property } from "@/lib/properties"

export function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  // Lançamento é vendido a partir de uma tabela, não por um valor fechado.
  const pricePrefix = property.kind === "lancamento" && property.price ? "A partir de " : ""

  return (
    <article className="group h-full">
      <Link
        href={`/imoveis/${property.slug}`}
        className="flex h-full flex-col border border-line bg-paper p-2.5 transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:border-graphite/25 hover:shadow-[0_24px_48px_-40px_rgba(35,38,46,0.7)]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-deep">
          <Image
            src={property.image || placeholderImage}
            alt={`${property.name}, ${property.district}`}
            fill
            priority={priority}
            unoptimized={!property.image}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
          />

          <span className="absolute left-2.5 top-2.5 bg-cream/95 px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em]">
            {statusLabels[property.status]}
          </span>

          <span className="absolute right-2.5 top-2.5 bg-graphite/88 px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-cream">
            {kindLabels[property.kind]}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 px-2 pb-2.5 pt-3.5">
          {/* Título e código dividem a linha: é por ele que o cliente pergunta. */}
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="display text-[1.4rem] leading-tight transition-colors group-hover:text-gold-deep">
              {property.name}
            </h3>
            <span className="shrink-0 text-[10px] tracking-[0.16em] text-muted-light">{property.reference}</span>
          </div>

          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted">
            <PinIcon />
            {property.district} · {property.city}/{property.state}
          </p>

          <PropertySpecs property={property} layout="cells" />

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
            <span className="display text-[1.35rem] leading-none">
              {pricePrefix && (
                <span className="mr-1 font-[family-name:var(--font-sans)] text-[11px] text-muted">{pricePrefix}</span>
              )}
              {formatPrice(property.price)}
            </span>

            <span className="inline-flex shrink-0 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-gold-deep">
              Ver imóvel
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}
