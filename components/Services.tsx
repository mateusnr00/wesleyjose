"use client"

import Image from "next/image"
import { useState } from "react"
import { Reveal, RevealGroup } from "./Reveal"

const services = [
  {
    title: "Residências",
    summary: "Casas de alto padrão em condomínio fechado e em bairros consolidados de Goiânia.",
    detail:
      "Avaliamos implantação no lote, orientação solar, qualidade construtiva e o histórico de valorização do endereço. Você recebe um comparativo com as transações reais dos últimos 24 meses no mesmo raio.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Coberturas",
    summary: "Unidades de topo com vista permanente, terraço privativo e planta diferenciada.",
    detail:
      "Cobertura boa é escassa e some rápido. Mantemos relação direta com síndicos e proprietários das torres mais procuradas para saber da unidade antes de ela virar anúncio.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Lançamentos",
    summary: "Acesso a tabelas de pré-lançamento e às melhores posições de cada torre.",
    detail:
      "Negociamos direto com o incorporador, o que costuma significar condição de pagamento mais longa e escolha de unidade antes da abertura pública de vendas. Sem custo adicional para o comprador.",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Off-market",
    summary: "Imóveis em negociação reservada, sem anúncio e sem exposição do proprietário.",
    detail:
      "Para quem vende, é discrição total: nenhuma placa, nenhum portal, nenhuma visita sem qualificação prévia. Para quem compra, é acesso a um estoque que simplesmente não existe publicamente.",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
  },
]

export function Services() {
  const [active, setActive] = useState(0)

  return (
    <section id="consultoria" className="py-section">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <Reveal variant="left">
          <p className="eyebrow">Consultoria</p>
          <h2 className="display mt-7 max-w-md text-[2.25rem] lg:text-[3rem]">
            Quatro frentes, <em>uma só</em> consultoria.
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-line">
          <RevealGroup variant="up" step={80}>
          {services.map((service, index) => {
            const isOpen = active === index

            return (
              <div key={service.title} className="border-b border-line">
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
                      src={service.image}
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
