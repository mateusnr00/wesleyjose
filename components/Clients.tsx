"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Destaque } from "./Destaque"
import { Reveal } from "./Reveal"

type Cliente = { id: string; nome?: string; descricao?: string; logo?: string }

/** Quantas vezes a lista é repetida para o laço não ter emenda. */
const REPETICOES = 4

/**
 * Prova social por nome, numa esteira que corre de lado.
 *
 * O tratamento é tipográfico quando não há logo: logotipo de terceiro vem cada
 * um numa proporção, num peso e numa cor, e a fileira acaba parecendo painel de
 * patrocínio. Com logo, ele entra no lugar do nome.
 *
 * A esteira é CSS puro. Biblioteca de carrossel traria arrasto, paginação e
 * gestos que aqui não servem para nada: ninguém quer navegar entre clientes,
 * só vê-los passar.
 */
export function Clients({ block, items }: { block: Record<string, string>; items: Cliente[] }) {
  const [menosMovimento, setMenosMovimento] = useState(false)
  const [parada, setParada] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const aplicar = () => setMenosMovimento(mq.matches)
    aplicar()
    mq.addEventListener("change", aplicar)
    return () => mq.removeEventListener("change", aplicar)
  }, [])

  useEffect(() => {
    const alvo = ref.current
    if (!alvo || menosMovimento) return

    const observer = new IntersectionObserver(([e]) => setParada(!e.isIntersecting), { threshold: 0 })
    observer.observe(alvo)
    return () => observer.disconnect()
  }, [menosMovimento])

  if (items.length === 0) return null

  // Sem animação, uma cópia só, numa fileira que o visitante rola com o dedo.
  const copias = menosMovimento ? 1 : REPETICOES

  return (
    <section className="overflow-hidden border-y border-line py-section">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-end">
            <div>
              <p className="eyebrow">{block.eyebrow}</p>
              <h2 className="display mt-7 max-w-md text-[2.25rem] lg:text-[3rem]">
                <Destaque>{block.title}</Destaque>
              </h2>
            </div>
            <p className="text-[13px] leading-relaxed text-muted lg:pb-3">{block.text}</p>
          </div>
        </Reveal>
      </div>

      {/* Sangra a largura toda: os itens entram e saem pelas bordas da tela,
          com as pontas esmaecidas para não parecer corte seco. */}
      <div
        ref={ref}
        className="relative mt-14"
        style={{
          maskImage: "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
        }}
      >
        <ul
          data-parada={parada ? "true" : undefined}
          className={`flex w-max ${menosMovimento ? "overflow-x-auto" : "esteira"}`}
        >
          {Array.from({ length: copias }).flatMap((_, copia) =>
            items.map((cliente) => (
              <li
                key={`${copia}-${cliente.id}`}
                // Só a primeira cópia é anunciada: as demais são visuais e
                // repeti-las faria o leitor de tela ler a lista quatro vezes.
                aria-hidden={copia > 0 ? true : undefined}
                className="flex w-[16rem] shrink-0 flex-col justify-center gap-3 border-r border-line px-8 sm:w-[19rem]"
              >
                {cliente.logo ? (
                  <span className="relative block h-10 w-full max-w-[11rem]">
                    <Image
                      src={cliente.logo}
                      alt={copia > 0 ? "" : (cliente.nome ?? "")}
                      fill
                      sizes="176px"
                      className="object-contain object-left"
                    />
                  </span>
                ) : (
                  <span className="display text-xl leading-tight">{cliente.nome}</span>
                )}

                <span className="text-[10px] uppercase tracking-[0.18em] text-muted">{cliente.descricao}</span>
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  )
}
