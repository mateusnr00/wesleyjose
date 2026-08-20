"use client"

import Image from "next/image"
import { useSite } from "./SiteContext"
import { Destaque } from "./Destaque"
import { Reveal, RevealGroup } from "./Reveal"

type Pilar = { id: string; title?: string; text?: string }

export function About({ block, pillars }: { block: Record<string, string>; pillars: Pilar[] }) {
  const site = useSite()

  return (
    <section id="sobre" className="py-section">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-24">
          <Reveal variant="clip" duration={1200}>
            <figure>
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream-deep">
                <Image
                  src={block.photo}
                  alt={`${site.founderName}, ${site.founderRole} da ${site.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted">
                <span>{site.founderName}</span>
                <span className="h-px w-6 bg-gold" aria-hidden="true" />
                <span>{site.creci}</span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal variant="right" delay={120}>
            <p className="eyebrow">{block.eyebrow}</p>

            <h2 className="display mt-7 max-w-lg text-[2.25rem] lg:text-[3rem]">
              <Destaque>{block.title}</Destaque>
            </h2>

            <div className="mt-8 max-w-xl space-y-5 text-muted">
              <p>{block.text1}</p>
              <p>{block.text2}</p>
            </div>

            <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
              <RevealGroup variant="up" step={110} initialDelay={100}>
                {pillars.map((pillar) => (
                  <div key={pillar.id}>
                    <h3 className="display text-lg">{pillar.title}</h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-muted">{pillar.text}</p>
                  </div>
                ))}
              </RevealGroup>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
