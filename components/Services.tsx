"use client"

import Image from "next/image"
import { useState } from "react"
import { Destaque } from "./Destaque"
import { Reveal, RevealGroup } from "./Reveal"

type Frente = { id: string; title?: string; summary?: string; detail?: string; image?: string }

export function Services({ block, services }: { block: Record<string, string>; services: Frente[] }) {
  const [active, setActive] = useState(0)

  return (
    <section id="consultoria" className="py-section">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <Reveal variant="left">
          <p className="eyebrow">{block.eyebrow}</p>
          <h2 className="display mt-7 max-w-md text-[2.25rem] lg:text-[3rem]">
            <Destaque>{block.title}</Destaque>
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-line">
          <RevealGroup variant="up" step={80}>
          {services.map((service, index) => {
            const isOpen = active === index

            return (
              <div key={service.id} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    onClick={() => setActive(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    aria-controls={`servico-${index}`}
                    className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-6 py-7 text-left transition-colors hover:text-gold-deep lg:grid-cols-[auto_minmax(0,0.9fr)_minmax(0,1.1fr)_auto] lg:gap-10"
                  >
                    <span className="text-[10px] tracking-[0.2em] text-muted-light">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="display text-2xl lg:text-[1.75rem]">{service.title}</span>
                    <span className="hidden text-[13px] text-muted lg:block">{service.summary}</span>
                    <span
                      aria-hidden="true"
                      className={`text-lg text-muted transition-transform duration-400 ${isOpen ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <div
                  id={`servico-${index}`}
                  hidden={!isOpen}
                  className="grid gap-8 pb-10 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.5fr)] sm:items-center lg:pl-[3.75rem]"
                >
                  <p className="max-w-xl text-muted">
                    <span className="mb-3 block text-[13px] lg:hidden">{service.summary}</span>
                    {service.detail}
                  </p>
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-cream-deep">
                    <Image
                      src={service.image ?? ""}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            )
          })}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
