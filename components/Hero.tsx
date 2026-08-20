"use client"

import Image from "next/image"
import Link from "next/link"
import { CountUp } from "./CountUp"
import { Destaque } from "./Destaque"
import { PropertySearch } from "./PropertySearch"
import { useSite } from "./SiteContext"
import { waLink } from "@/lib/whatsapp"
import { placeholderImage, type Property } from "@/lib/properties"

export function Hero({
  block,
  stats,
  spotlight,
  districts,
}: {
  block: Record<string, string>
  stats: { id: string; value?: string; label?: string }[]
  spotlight?: Property
  districts: string[]
}) {
  const site = useSite()


  return (
    <section className="relative overflow-hidden pt-32 lg:pt-40">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          {/* Coluna editorial */}
          <div className="enter-up max-w-xl">
            <p className="eyebrow">{block.eyebrow}</p>

            <h1 className="display mt-8 text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem]">
              <Destaque>{block.title}</Destaque>
            </h1>

            <p className="mt-8 max-w-md text-muted">
{block.text}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/imoveis"
                className="bg-graphite px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold"
              >
                {block.ctaPrimary}
              </Link>
              <a
                href={waLink(site.whatsapp, `Olá! Vim pelo site da ${site.name} e quero conversar sobre um imóvel.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-graphite/25 px-8 py-4 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-graphite"
              >
                {block.ctaSecondary}
              </a>
            </div>

            {/* Prova social numérica */}
            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-line pt-8">
              {stats.map((stat) => (
                <div key={stat.id}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="display block text-2xl lg:text-[1.75rem]">
                      <CountUp value={stat.value ?? ""} />
                    </span>
                    <span className="mt-2 block text-[10px] uppercase tracking-[0.16em] text-muted">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Imagem de destaque com etiqueta do imóvel */}
          {spotlight && (
            <div className="enter-up enter-delay-1 relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src={spotlight.image || placeholderImage}
                  alt={`${spotlight.name}, ${spotlight.district}`}
                  fill
                  priority
                  unoptimized={!spotlight.image}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="enter-zoom object-cover"
                />
              </div>

              <Link
                href={`/imoveis/${spotlight.slug}`}
                className="group absolute bottom-6 left-6 max-w-[15rem] bg-cream/95 p-6 backdrop-blur-sm transition-transform duration-500 hover:-translate-y-1"
              >
                <span className="text-[9px] uppercase tracking-[0.22em] text-gold-deep">{block.spotlightLabel}</span>
                <span className="display mt-2 block text-xl">{spotlight.name}</span>
                <span className="mt-1 block text-[11px] text-muted">
                  {spotlight.district} · {spotlight.area} m²
                </span>
                <span className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]">
                  Ver imóvel
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Busca com filtros, atalho para o catálogo */}
        <div className="enter-up enter-delay-2 relative z-10 mt-16 lg:-mt-4 lg:mb-4">
          <PropertySearch districts={districts} />
        </div>
      </div>
    </section>
  )
}
