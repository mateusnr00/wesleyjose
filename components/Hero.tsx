"use client"

import Link from "next/link"
import { CountUp } from "./CountUp"
import { Destaque } from "./Destaque"
import { HeroMedia } from "./HeroMedia"
import { PropertySearch } from "./PropertySearch"
import { useSite } from "./SiteContext"
import type { Property } from "@/lib/properties"
import { waLink } from "@/lib/whatsapp"

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

  // O fundo do topo é escolha explícita. Antes, sem foto definida, ele pegava
  // emprestada a do imóvel em destaque: a home passava a exibir uma casa
  // qualquer como capa da marca, e trocava sozinha quando o destaque mudava.
  const fundo = block.image || undefined

  return (
    <>
      <section className="relative min-h-[88svh] overflow-hidden bg-gradient-to-b from-navy via-graphite to-graphite lg:min-h-[92svh]">
        <div className="absolute inset-0">
          <HeroMedia
            image={fundo}
            video={block.video || undefined}
            alt={block.eyebrow || site.tagline}
          />
        </div>

        {/* Dois véus em vez de um só escuro.
            O vertical firma a base, onde ficam os números e a busca. O
            horizontal escurece apenas a faixa da esquerda, onde vive o texto,
            e deixa o lado direito do vídeo aparecer. Escurecer o quadro
            inteiro o suficiente para garantir leitura apagaria o vídeo. */}
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/92 via-graphite/40 to-graphite/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-graphite/80 via-graphite/25 to-transparent lg:via-graphite/15" />

        <div className="relative mx-auto flex min-h-[88svh] max-w-[1360px] flex-col justify-end px-6 pb-9 pt-28 lg:min-h-[92svh] lg:px-12 lg:pb-16 lg:pt-32">
          <div className="enter-up max-w-2xl">
            <p className="eyebrow text-cream/70">{block.eyebrow}</p>

            <h1 className="display mt-5 text-[2.35rem] text-cream sm:text-[3.25rem] lg:mt-7 lg:text-[4.5rem]">
              <Destaque>{block.title}</Destaque>
            </h1>

            <p className="mt-5 max-w-lg text-[14px] text-cream/80 lg:mt-7 lg:text-[15px]">{block.text}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3 lg:mt-9 lg:gap-4">
              <Link
                href="/imoveis"
                className="bg-cream px-7 py-3.5 text-[10px] uppercase tracking-[0.2em] text-graphite transition-colors hover:bg-gold hover:text-cream lg:px-8 lg:py-4"
              >
                {block.ctaPrimary}
              </Link>
              <a
                href={waLink(site.whatsapp, `Olá! Vim pelo site da ${site.name} e quero conversar sobre um imóvel.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-cream/40 px-7 py-3.5 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors hover:border-cream hover:bg-cream hover:text-graphite lg:px-8 lg:py-4"
              >
                {block.ctaSecondary}
              </a>
            </div>
          </div>

          {/* Rodapé do topo: números à esquerda, imóvel em destaque à direita. */}
          <div className="enter-up enter-delay-1 mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-8 border-t border-cream/20 pt-6 lg:mt-12 lg:pt-8">
            <dl className="grid flex-1 grid-cols-3 gap-6 sm:max-w-lg">
              {stats.map((stat) => (
                <div key={stat.id}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="display block text-xl text-cream lg:text-[1.75rem]">
                      <CountUp value={stat.value ?? ""} />
                    </span>
                    <span className="mt-2 block text-[10px] uppercase tracking-[0.16em] text-cream/65">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            {spotlight && (
              <Link
                href={`/imoveis/${spotlight.slug}`}
                className="group hidden shrink-0 flex-col gap-1 border-l border-cream/20 pl-6 lg:flex"
              >
                <span className="text-[9px] uppercase tracking-[0.22em] text-gold-soft">
                  {block.spotlightLabel}
                </span>
                <span className="display text-xl text-cream transition-colors group-hover:text-gold-soft">
                  {spotlight.name}
                </span>
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-cream/65">
                  {spotlight.district} · {spotlight.area} m²
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* No desktop a busca avança sobre a borda do topo. No celular isso
          encostava o painel branco no topo escuro sem respiro nenhum, então
          ali ela vira um bloco próprio, com o fundo da página em volta. */}
      <div className="bg-cream">
        <div className="mx-auto max-w-[1360px] px-6 py-10 lg:px-12 lg:py-0">
          <div className="enter-up enter-delay-2 relative z-10 lg:-mt-12">
            <PropertySearch districts={districts} />
          </div>
        </div>
      </div>
    </>
  )
}
