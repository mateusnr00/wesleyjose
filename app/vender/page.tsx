import type { Metadata } from "next"
import Image from "next/image"
import { Faq } from "@/components/Faq"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { ScrollProgress } from "@/components/Reveal"
import { Reveal } from "@/components/Reveal"
import { ValuationForm } from "@/components/ValuationForm"
import { WhatsAppFloat } from "@/components/WhatsAppFloat"
import { Destaque } from "@/components/Destaque"
import { getSiteContent, list, t } from "@/lib/content"
import { districtsOf } from "@/lib/properties"
import { getProperties } from "@/lib/queries"

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent()
  return { title: "Vender meu imóvel em Goiânia", description: t(c, "vender_topo", "text") }
}




export const revalidate = 3600

export default async function SellPage() {
  const [imoveis, c] = await Promise.all([getProperties(), getSiteContent()])
  const districts = districtsOf(imoveis)
  const reasons = list(c, "vender_motivos")
  const steps = list(c, "vender_etapas")
  const faq = list(c, "duvidas")

  return (
    <>
      <ScrollProgress />
      <Header />

      <main id="conteudo">
        {/* Topo com formulário logo de cara: o objetivo da página é uma conversão só */}
        <section className="pt-36 lg:pt-44">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-20">
              <div className="max-w-xl">
                <p className="eyebrow">{t(c, "vender_topo", "eyebrow")}</p>

                <h1 className="display mt-8 text-[2.75rem] lg:text-[4rem]">
                  <Destaque>{t(c, "vender_topo", "title")}</Destaque>
                </h1>

                <p className="mt-8 max-w-md text-muted">
{t(c, "vender_topo", "text")}
                </p>

                <ul className="mt-10 space-y-4">
                  {list(c, "vender_beneficios").map((item) => (
                    <li key={item.id} className="flex items-start gap-3 text-[13px]">
                      <span className="mt-2 size-1 shrink-0 bg-gold" aria-hidden="true" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <ValuationForm districts={districts} prazos={list(c, "vender_prazos")} />
            </div>
          </div>
        </section>

        {/* Argumentos com números */}
        <section className="py-section">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <p className="eyebrow">{t(c, "vender_porque", "eyebrow")}</p>

            <h2 className="display mt-7 max-w-lg text-[2.25rem] lg:text-[3rem]">
              <Destaque>{t(c, "vender_porque", "title")}</Destaque>
            </h2>

            <div className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-3 lg:gap-16">
              {reasons.map((reason, index) => (
                <Reveal key={reason.id} delay={index * 110}>
                  <p className="display text-4xl lg:text-5xl">{reason.value}</p>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-gold-deep">{reason.label}</p>
                  <p className="mt-5 text-[13px] leading-relaxed text-muted">{reason.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Processo */}
        <section id="processo" className="bg-cream-deep/60 py-section">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end">
              <div>
                <p className="eyebrow">{t(c, "vender_processo", "eyebrow")}</p>
                <h2 className="display mt-7 max-w-md text-[2.25rem] lg:text-[3rem]">
                  <Destaque>{t(c, "vender_processo", "title")}</Destaque>
                </h2>
              </div>
              <p className="text-muted lg:pb-3">
{t(c, "vender_processo", "text")}
              </p>
            </div>

            <ol className="mt-16 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <li key={step.id} className="bg-cream p-8 lg:p-10">
                  <span className="text-[10px] tracking-[0.2em] text-gold-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display mt-5 text-xl">{step.title}</h3>
                  <p className="mt-4 text-[13px] leading-relaxed text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Depoimento de quem vendeu */}
        <section className="relative overflow-hidden bg-navy">
          <div className="absolute inset-0">
            <Image
              src={t(c, "vender_depoimento", "image")}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-navy/85" />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 py-28 text-center text-cream lg:py-36">
            <blockquote className="display text-2xl leading-snug lg:text-[2rem]">
“{t(c, "vender_depoimento", "quote")}”
            </blockquote>
            <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-cream/60">
{t(c, "vender_depoimento", "author")}
            </p>
          </div>
        </section>

        {/* Dúvidas */}
        <section className="py-section">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-24">
              <div>
                <p className="eyebrow">{t(c, "vender_duvidas", "eyebrow")}</p>
                <h2 className="display mt-7 text-[2.25rem] lg:text-[3rem]">
                  <Destaque>{t(c, "vender_duvidas", "title")}</Destaque>
                </h2>
              </div>

              <Faq items={faq} />
            </div>
          </div>
        </section>
      </main>

      <Footer text={t(c, "rodape", "text")} legal={t(c, "rodape", "legal")} estados={list(c, "estados")} />
      <WhatsAppFloat />
    </>
  )
}
