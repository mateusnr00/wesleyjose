import type { Metadata } from "next"
import Image from "next/image"
import { Faq } from "@/components/Faq"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { ScrollProgress } from "@/components/Reveal"
import { Reveal } from "@/components/Reveal"
import { ValuationForm } from "@/components/ValuationForm"
import { WhatsAppFloat } from "@/components/WhatsAppFloat"
import { districtsOf } from "@/lib/properties"
import { getProperties } from "@/lib/queries"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Vender meu imóvel em Goiânia",
  description:
    "Avaliação gratuita baseada em transações reais do seu bairro. Venda com discrição, sem placa e sem exposição em portal, com uma rede de compradores qualificados.",
}

const reasons = [
  {
    value: "24 meses",
    label: "de transações reais analisadas",
    text: "A faixa de valor vem do que de fato foi negociado no seu bairro, não do preço pedido em anúncio, que costuma estar 15% acima do fechamento.",
  },
  {
    value: "68 dias",
    label: "de prazo médio de venda",
    text: "Precificação correta na largada é o que separa uma venda de 60 dias de um imóvel encalhado há dois anos com desconto sucessivo.",
  },
  {
    value: "0 placas",
    label: "na fachada, se você preferir",
    text: "Vendemos off-market quando faz sentido: sem anúncio público, sem visita de curioso e sem seus vizinhos sabendo da negociação.",
  },
]

const steps = [
  {
    title: "Avaliação",
    text: "Você preenche o formulário e recebe, em até 48h, um estudo com faixa de valor, comparáveis do bairro e tempo estimado de venda.",
  },
  {
    title: "Visita técnica",
    text: "Um consultor visita o imóvel para conferir estado de conservação, diferenciais que a planta não mostra e o que vale ajustar antes de fotografar.",
  },
  {
    title: "Preparação",
    text: "Fotografia profissional, planta humanizada e um dossiê com documentação pré-auditada. Comprador de alto padrão desiste na primeira dúvida jurídica.",
  },
  {
    title: "Negociação",
    text: "Apresentamos primeiro à nossa carteira. Se abrir ao mercado, você aprova cada canal. Conduzimos proposta, contraproposta e escritura até a chave trocar de mão.",
  },
]

const faq = [
  {
    question: "A avaliação tem algum custo?",
    answer:
      "Não. O estudo é gratuito e não gera obrigação de vender conosco. Muitos proprietários pedem a avaliação apenas para entender o próprio patrimônio, e isso é legítimo.",
  },
  {
    question: "Preciso assinar exclusividade?",
    answer:
      "Trabalhamos com contrato de exclusividade porque ele é o que viabiliza o investimento em fotografia, dossiê e curadoria de compradores. Mas o prazo é discutido caso a caso e sempre com cláusula de saída.",
  },
  {
    question: "Qual é a comissão?",
    answer:
      "Seguimos a tabela do CRECI-GO para imóveis urbanos. O percentual exato é definido no contrato, junto com o que está incluso, e nada é cobrado antes do fechamento.",
  },
  {
    question: "Meu imóvel vai aparecer em portal?",
    answer:
      "Só se você autorizar. Uma parte relevante do que vendemos nunca é anunciada: apresentamos direto à carteira de compradores qualificados, o que preserva sua privacidade e evita desgastar o imóvel no mercado.",
  },
  {
    question: "Vocês atendem fora de Goiânia?",
    answer:
      `A ${site.name} atua em Goiânia e região metropolitana, incluindo Aparecida de Goiânia e Senador Canedo. Para imóveis fora dessa área, avaliamos caso a caso.`,
  },
]

export const revalidate = 3600

export default async function SellPage() {
  const districts = districtsOf(await getProperties())

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
                <p className="eyebrow">Para proprietários</p>

                <h1 className="display mt-8 text-[2.75rem] lg:text-[4rem]">
                  Quanto vale, de <em>verdade</em>, o seu imóvel?
                </h1>

                <p className="mt-8 max-w-md text-muted">
                  Anúncio não é valor de mercado. Preencha os dados ao lado e receba em até 48 horas
                  um estudo com a faixa real do seu bairro, o tempo médio de venda e a estratégia que
                  recomendamos para o seu caso.
                </p>

                <ul className="mt-10 space-y-4">
                  {[
                    "Gratuito e sem compromisso",
                    "Baseado em transações fechadas, não em anúncios",
                    "Resposta de um consultor, não de um robô",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13px]">
                      <span className="mt-2 size-1 shrink-0 bg-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <ValuationForm districts={districts} />
            </div>
          </div>
        </section>

        {/* Argumentos com números */}
        <section className="py-section">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <p className="eyebrow">Por que conosco</p>

            <h2 className="display mt-7 max-w-lg text-[2.25rem] lg:text-[3rem]">
              Vender bem é uma questão de <em>informação</em>, não de sorte.
            </h2>

            <div className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-3 lg:gap-16">
              {reasons.map((reason, index) => (
                <Reveal key={reason.value} delay={index * 110}>
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
                <p className="eyebrow">O processo</p>
                <h2 className="display mt-7 max-w-md text-[2.25rem] lg:text-[3rem]">
                  Quatro etapas, <em>zero</em> improviso.
                </h2>
              </div>
              <p className="text-muted lg:pb-3">
                Da primeira conversa à escritura, você sabe exatamente em que ponto está e o que
                acontece depois.
              </p>
            </div>

            <ol className="mt-16 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <li key={step.title} className="bg-cream p-8 lg:p-10">
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
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-navy/85" />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 py-28 text-center text-cream lg:py-36">
            <blockquote className="display text-2xl leading-snug lg:text-[2rem]">
              “Vendi pelo valor pretendido em menos de 60 dias. Discrição absoluta, comunicação
              impecável e uma rede de compradores realmente qualificados.”
            </blockquote>
            <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-cream/60">
              Larissa Sousa · Vendedora, Alphaville Flamboyant
            </p>
          </div>
        </section>

        {/* Dúvidas */}
        <section className="py-section">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-24">
              <div>
                <p className="eyebrow">Dúvidas</p>
                <h2 className="display mt-7 text-[2.25rem] lg:text-[3rem]">
                  Antes de <em>decidir</em>.
                </h2>
              </div>

              <Faq items={faq} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  )
}
