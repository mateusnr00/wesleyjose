import { Reveal } from "./Reveal"
import { site } from "@/lib/site"

/** TODO(cliente): substituir por depoimentos reais, com autorização de uso do nome. */
const testimonials = [
  {
    quote:
      "A Premium conduziu cada etapa com a paciência e o cuidado que eu esperava. Encontramos a casa certa e chegamos ao fim sem desgaste nenhum.",
    author: "Mariana Felippe Ribeiro",
    role: "Compradora · Setor Marista",
  },
  {
    quote:
      "É raro encontrar corretor que entenda patrimônio. Aqui pensam como sócio do cliente, inclusive quando a recomendação é não comprar.",
    author: "Amauri Antunes",
    role: "Investidor · Jardim Goiás",
  },
  {
    quote:
      "Vendi pelo valor pretendido em menos de 60 dias. Discrição absoluta, comunicação impecável e uma rede de compradores realmente qualificados.",
    author: "Larissa Sousa",
    role: "Vendedora · Alphaville Flamboyant",
  },
]

export function Testimonials() {
  return (
    <section className="bg-navy py-section text-cream">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
          <Reveal variant="left">
            <p className="eyebrow text-cream/60">Clientes</p>
            <h2 className="display mt-7 max-w-sm text-[2.25rem] text-cream lg:text-[3rem]">
              Relações que <em>permanecem</em> depois das chaves.
            </h2>
            <p className="mt-8 max-w-sm text-sm text-cream/60">
              A maior parte dos negócios da {site.name} chega por indicação de quem já comprou ou vendeu
              com a gente. É o indicador que levamos mais a sério.
            </p>
          </Reveal>

          <div className="space-y-5">
            {testimonials.map((item, index) => (
              <Reveal key={item.author} variant="right" delay={index * 120}>
                <figure className="bg-navy-soft p-8 lg:p-10">
                  <div className="flex gap-1 text-gold-soft" role="img" aria-label="Avaliação: 5 de 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>

                  <blockquote className="display mt-6 text-lg leading-snug text-cream/90 lg:text-xl">
                    “{item.quote}”
                  </blockquote>

                  <figcaption className="mt-7 border-t border-cream/10 pt-5">
                    <span className="block text-[11px] uppercase tracking-[0.18em]">{item.author}</span>
                    <span className="mt-1 block text-[11px] text-cream/60">{item.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="size-3 fill-current" aria-hidden="true">
      <path d="M12 2l2.9 6.26L21.5 9.2l-4.8 4.6 1.2 6.7L12 17.3l-5.9 3.2 1.2-6.7-4.8-4.6 6.6-.94L12 2z" />
    </svg>
  )
}
