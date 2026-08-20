import Image from "next/image"
import Link from "next/link"
import { Destaque } from "./Destaque"
import { Reveal, RevealGroup } from "./Reveal"

/**
 * Bifurcação explícita entre quem compra e quem vende.
 *
 * O site inteiro conversa com o comprador; sem esta divisão, o proprietário
 * que chegou pelo Instagram tem de deduzir sozinho que também é atendido.
 */
type Caminho = { id: string; label?: string; title?: string; text?: string; href?: string; cta?: string; image?: string }

export function PathCards({ block, paths }: { block: Record<string, string>; paths: Caminho[] }) {
  if (paths.length === 0) return null

  return (
    <section className="py-section">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <Reveal>
          <p className="eyebrow">{block.eyebrow}</p>
          <h2 className="display mt-6 max-w-lg text-[2rem] lg:text-[2.75rem]">
            <Destaque>{block.title}</Destaque>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <RevealGroup variant="up" step={130}>
            {paths.map((path) => (
              <Link
                key={path.id}
                href={path.href ?? "/"}
                className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden bg-graphite p-8 lg:min-h-[26rem] lg:p-10"
              >
                <Image
                  src={path.image ?? ""}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/45 to-graphite/10" />

                <div className="relative">
                  <span className="text-[9px] uppercase tracking-[0.24em] text-gold-soft">{path.label}</span>

                  <h3 className="display mt-4 text-2xl text-cream lg:text-[1.9rem]">{path.title}</h3>

                  <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-cream/70">{path.text}</p>

                  <span className="mt-7 inline-flex items-center gap-3 border-b border-cream/35 pb-2 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors group-hover:border-gold group-hover:text-gold-soft">
                    {path.cta}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
