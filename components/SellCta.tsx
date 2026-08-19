import Image from "next/image"
import Link from "next/link"
import { Reveal } from "./Reveal"

/**
 * Ponte para o funil de quem vende. O site inteiro fala com quem compra;
 * esta faixa existe para não perder o proprietário que chegou pelo Instagram.
 */
export function SellCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
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
            <p className="eyebrow text-cream/60">Para proprietários</p>

            <h2 className="display mt-7 text-[2.25rem] text-cream lg:text-[3rem]">
              Seu imóvel vale mais do que a <em>tabela do portal</em> sugere.
            </h2>

            <p className="mt-7 max-w-md text-cream/75">
              Preparamos uma avaliação gratuita com base nas transações reais do seu bairro nos últimos
              24 meses — não em anúncios. Você recebe a faixa de valor, o tempo médio de venda e a
              estratégia que recomendamos. Sem compromisso e sem placa na fachada.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/vender"
                className="bg-cream px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-graphite transition-colors hover:bg-gold hover:text-cream"
              >
                Avaliar meu imóvel
              </Link>
              <Link
                href="/vender#processo"
                className="border border-cream/35 px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors hover:border-cream"
              >
                Como funciona
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
