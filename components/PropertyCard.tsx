import Image from "next/image"
import Link from "next/link"
import { PropertySpecs } from "./PropertySpecs"
import { formatPrice, kindLabels, placeholderImage, statusLabels, type Property } from "@/lib/properties"

export function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  // Lançamento é vendido a partir de uma tabela, não por um valor fechado.
  const pricePrefix = property.kind === "lancamento" && property.price ? "A partir de " : ""

  return (
    <article className="group h-full">
      <Link href={`/imoveis/${property.slug}`} className="flex h-full flex-col">
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

          {/* Véu que escurece no hover, para o texto do rodapé destacar. */}
          <div className="absolute inset-0 bg-graphite/0 transition-colors duration-700 group-hover:bg-graphite/12" />

          <span className="absolute left-4 top-4 bg-cream/95 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em]">
            {statusLabels[property.status]}
          </span>

          <span className="absolute right-4 top-4 bg-graphite/85 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-cream">
            {kindLabels[property.kind]}
          </span>

          {/* Código de referência: é por ele que o cliente pergunta no WhatsApp. */}
          <span className="absolute bottom-4 left-4 bg-graphite/70 px-2.5 py-1 text-[9px] tracking-[0.16em] text-cream/90 backdrop-blur-sm">
            {property.reference}
          </span>
        </div>

        <h3 className="display mt-5 text-xl transition-colors group-hover:text-gold">{property.name}</h3>

        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
          {property.district} · {property.city}
        </p>

        <PropertySpecs property={property} className="mt-4" />

        <div className="mt-auto flex items-center justify-between border-t border-line pt-4 [&:not(:first-child)]:mt-5">
          <span className="text-sm">
            {pricePrefix && <span className="text-[11px] text-muted">{pricePrefix}</span>}
            {formatPrice(property.price)}
          </span>
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-graphite">
            Ver imóvel
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  )
}
