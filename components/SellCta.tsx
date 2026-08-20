import Image from "next/image"
import Link from "next/link"
import { Destaque } from "./Destaque"
import { Reveal } from "./Reveal"

/**
 * Ponte para o funil de quem vende. O site inteiro fala com quem compra;
 * esta faixa existe para não perder o proprietário que chegou pelo Instagram.
 */
export function SellCta({ block }: { block: Record<string, string> }) {
  return (
    <section className="relative overflow-hidden bg-graphite">
      <div className="absolute inset-0">
        <Image
          src={block.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-graphite/72" />
      </div>

      <div className="relative mx-auto max-w-[1360px] px-6 py-28 lg:px-12 lg:py-36">
        <Reveal variant="left">
          <div className="max-w-xl text-cream">
            <p className="eyebrow text-cream/60">{block.eyebrow}</p>

            <h2 className="display mt-7 text-[2.25rem] text-cream lg:text-[3rem]">
              <Destaque>{block.title}</Destaque>
            </h2>

            <p className="mt-7 max-w-md text-cream/75">
{block.text}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/vender"
                className="bg-cream px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-graphite transition-colors hover:bg-gold hover:text-cream"
              >
                {block.ctaPrimary}
              </Link>
              <Link
                href="/vender#processo"
                className="border border-cream/35 px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors hover:border-cream"
              >
                {block.ctaSecondary}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
