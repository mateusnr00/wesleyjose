import Image from "next/image"
import { Reveal, RevealGroup } from "./Reveal"
import { site } from "@/lib/site"

const pillars = [
  {
    title: "Curadoria",
    text: "Antes de apresentar, visitamos. Projeto, implantação, vizinhança e documentação são checados na origem.",
  },
  {
    title: "Discrição",
    text: "Boa parte do que negociamos nunca vira anúncio. Proprietário e comprador só se encontram quando faz sentido.",
  },
  {
    title: "Estratégia",
    text: "Precificação com base em transações reais do bairro, não em tabela de portal. Negociação conduzida por quem conhece o comprador.",
  },
]

export function About() {
  return (
    <section id="sobre" className="py-section">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-24">
          <Reveal variant="clip" duration={1200}>
            <figure>
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream-deep">
                {/* TODO(cliente): substituir pela foto oficial do consultor. */}
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"
                  alt={`${site.founder.name}, ${site.founder.role} da ${site.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted">
                <span>{site.founder.name}</span>
                <span className="h-px w-6 bg-gold" aria-hidden="true" />
                <span>{site.founder.creci}</span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal variant="right" delay={120}>
            <p className="eyebrow">A Premium</p>

            <h2 className="display mt-7 max-w-lg text-[2.25rem] lg:text-[3rem]">
              Patrimônio se <em>constrói</em> com escolhas raras.
            </h2>

            <div className="mt-8 max-w-xl space-y-5 text-muted">
              <p>
                A {site.name} nasceu de uma inconformidade simples: imóvel de alto padrão continua sendo
                vendido como commodity, empilhado em portal, com foto ruim e informação incompleta. Quem
                compra nessa faixa não precisa de mais opções — precisa das opções certas.
              </p>
              <p>
                Trabalhamos com um número deliberadamente pequeno de imóveis por vez. Isso permite conhecer
                cada um a fundo, conduzir a negociação com informação de verdade e proteger o tempo de quem
                está do outro lado da mesa.
              </p>
            </div>

            <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
              <RevealGroup variant="up" step={110} initialDelay={100}>
                {pillars.map((pillar) => (
                  <div key={pillar.title}>
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
