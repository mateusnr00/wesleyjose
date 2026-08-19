import Image from "next/image"
import Link from "next/link"
import { formatPrice, kindLabels, placeholderImage, statusLabels, type Property } from "@/lib/properties"

export function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  return (
    <article className="group">
      <Link href={`/imoveis/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-deep">
          <Image
            src={property.image || placeholderImage}
            unoptimized={!property.image}
            alt={`${property.name}, ${property.district}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />

          <span className="absolute left-4 top-4 bg-cream/95 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em]">
            {statusLabels[property.status]}
          </span>

          <span className="absolute right-4 top-4 bg-graphite/85 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-cream">
            {kindLabels[property.kind]}
          </span>
        </div>

        <h3 className="display mt-5 text-xl transition-colors group-hover:text-gold">{property.name}</h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
          {property.district} · {property.city}
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-muted">
          <li>{property.area} m²</li>
          <li>
            {property.suites} {property.suites === 1 ? "suíte" : "suítes"}
          </li>
          <li>
            {property.parking} {property.parking === 1 ? "vaga" : "vagas"}
          </li>
        </ul>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="text-sm">{formatPrice(property.price)}</span>
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-graphite">
            Ver imóvel
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  )
}
