import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CountUp } from "@/components/CountUp"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { PropertyActionBar } from "@/components/PropertyActionBar"
import { PropertyCard } from "@/components/PropertyCard"
import { PropertyGallery } from "@/components/PropertyGallery"
import { PropertyMap } from "@/components/PropertyMap"
import { PropertySectionNav } from "@/components/PropertySectionNav"
import { Reveal, RevealGroup, ScrollProgress } from "@/components/Reveal"
import { WhatsAppFloat } from "@/components/WhatsAppFloat"
import { formatPrice, kindLabels, placeholderImage, statusLabels } from "@/lib/properties"
import { getProperties, getProperty } from "@/lib/queries"
import { site, whatsappLink } from "@/lib/site"

export const revalidate = 3600

export async function generateStaticParams() {
  const properties = await getProperties()
  return properties.map((property) => ({ slug: property.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const property = await getProperty(slug)
  if (!property) return { title: "Imóvel não encontrado" }

  return {
    title: `${property.name}, ${property.district}`,
    description: property.headline,
    openGraph: { images: property.image ? [property.image] : [] },
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await getProperty(slug)
  if (!property) notFound()

  const others = (await getProperties()).filter((p) => p.slug !== property.slug).slice(0, 3)
  const fotos = [property.image, ...property.gallery].filter((src): src is string => Boolean(src))

  const numeros = [
    { valor: String(property.area), unidade: "m²", rotulo: "de área" },
    { valor: String(property.bedrooms), rotulo: property.bedrooms === 1 ? "quarto" : "quartos" },
    { valor: String(property.suites), rotulo: property.suites === 1 ? "suíte" : "suítes" },
    { valor: String(property.parking), rotulo: property.parking === 1 ? "vaga" : "vagas" },
  ].filter((n) => n.valor !== "0")

  const mensagem = `Olá! Tenho interesse no imóvel "${property.name}" (${property.reference}), em ${property.district}, que vi no site da ${site.name}.`

  return (
    <>
      <ScrollProgress />
      <Header />

      <main id="conteudo">
        {/* Topo: a foto ocupa a tela e o texto vive sobre ela. */}
        <section className="relative min-h-[78svh] overflow-hidden bg-graphite lg:min-h-[86svh]">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={property.image || placeholderImage}
              alt={`${property.name}, ${property.district}`}
              fill
              priority
              unoptimized={!property.image}
              sizes="100vw"
              className="parallax object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-graphite/92 via-graphite/35 to-graphite/50" />

          <div className="relative mx-auto flex min-h-[78svh] max-w-[1360px] flex-col justify-between px-6 pb-12 pt-28 lg:min-h-[86svh] lg:px-12 lg:pb-16 lg:pt-36">
            <nav aria-label="Trilha de navegação" className="text-[11px] uppercase tracking-[0.18em] text-cream/65">
              <Link href="/" className="tap transition-colors hover:text-cream">
                Início
              </Link>
              <span className="mx-3" aria-hidden="true">
                /
              </span>
              <Link href="/imoveis" className="tap transition-colors hover:text-cream">
                Imóveis
              </Link>
              <span className="mx-3" aria-hidden="true">
                /
              </span>
              <span className="text-cream">{property.name}</span>
            </nav>

            <div className="enter-up max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-cream px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-graphite">
                  {statusLabels[property.status]}
                </span>
                <span className="border border-cream/40 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-cream">
                  {kindLabels[property.kind]}
                </span>
                <span className="text-[10px] tracking-[0.18em] text-cream/60">Ref. {property.reference}</span>
              </div>

              <h1 className="display mt-6 text-[2.5rem] text-cream lg:text-[4rem]">{property.name}</h1>

              <p className="mt-4 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-cream/75">
                <svg viewBox="0 0 24 24" className="size-4 text-gold-soft" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.6" />
                </svg>
                {property.district} · {property.city}/{site.contact.address.state}
              </p>

              <div className="mt-9 flex flex-wrap items-end gap-x-10 gap-y-6">
                <p className="display text-[2rem] text-cream lg:text-[2.75rem]">{formatPrice(property.price)}</p>

                <a
                  href={whatsappLink(mensagem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cream px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-graphite transition-colors hover:bg-gold hover:text-cream"
                >
                  Agendar uma visita
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Números do imóvel, no espírito da faixa de destaques. */}
        <section className="bg-navy py-14 text-cream lg:py-16">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
              {numeros.map((n, i) => (
                <div
                  key={n.rotulo}
                  className={`px-2 text-center lg:px-6 ${i > 0 ? "lg:border-l lg:border-cream/12" : ""}`}
                >
                  <dt className="sr-only">{n.rotulo}</dt>
                  <dd>
                    <span className="display block text-[2.75rem] leading-none text-cream lg:text-[3.5rem]">
                      <CountUp value={n.valor} />
                      {n.unidade && <span className="ml-1 text-2xl text-cream/70">{n.unidade}</span>}
                    </span>
                    <span className="mt-3 block text-[10px] uppercase tracking-[0.2em] text-cream/60">
                      {n.rotulo}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
          <PropertySectionNav />

          {/* Descrição e painel de contato */}
          <section id="sobre" className="scroll-mt-32 pb-section">
            <div className="grid gap-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-24">
              <div>
                <Reveal variant="left">
                  <p className="eyebrow">O imóvel</p>
                  <p className="display mt-7 max-w-xl text-2xl leading-snug lg:text-[1.9rem]">{property.headline}</p>
                  <p className="mt-8 max-w-xl text-muted">{property.description}</p>
                </Reveal>

                {property.features.length > 0 && (
                  <div className="mt-14">
                    <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Diferenciais</h2>
                    {/* O reveal precisa ser o próprio <li>: envolver os itens
                        numa <div> quebraria a estrutura da lista para leitor de tela. */}
                    <ul className="mt-7 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                      {property.features.map((feature, i) => (
                        <Reveal
                          key={feature}
                          as="li"
                          variant="up"
                          delay={Math.min(i * 70, 420)}
                          className="flex items-start gap-3 border-b border-line pb-4 text-[13px]"
                        >
                          <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                            <path d="M4 12.5l5 5 11-11" />
                          </svg>
                          {feature}
                        </Reveal>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <aside className="lg:sticky lg:top-36 lg:self-start">
                <div className="border border-line bg-paper p-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Interessado?</p>

                  <p className="display mt-4 text-[1.75rem] leading-none">{formatPrice(property.price)}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-light">
                    Ref. {property.reference}
                  </p>

                  <p className="mt-7 text-[13px] leading-relaxed text-muted">
                    Visitas são agendadas com a presença de um consultor e ajustadas ao seu horário, inclusive fora
                    do comercial.
                  </p>

                  <a
                    href={whatsappLink(mensagem)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 block bg-graphite px-6 py-4 text-center text-[10px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold"
                  >
                    Falar sobre este imóvel
                  </a>

                  <a
                    href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`Interesse: ${property.name} (${property.reference})`)}`}
                    className="mt-3 block border border-graphite/25 px-6 py-4 text-center text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-graphite"
                  >
                    Enviar e-mail
                  </a>

                  <p className="mt-8 border-t border-line pt-6 text-[11px] text-muted">
                    {site.founder.name} · {site.founder.creci}
                  </p>
                </div>
              </aside>
            </div>
          </section>

          {/* Galeria */}
          {fotos.length > 0 && (
            <section id="galeria" className="scroll-mt-32 pb-section">
              <Reveal>
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className="eyebrow">Galeria</p>
                    <h2 className="display mt-6 text-[2rem] lg:text-[2.5rem]">
                      {fotos.length} {fotos.length === 1 ? "foto" : "fotos"} do imóvel.
                    </h2>
                  </div>
                  <p className="max-w-xs text-[13px] text-muted">Toque em qualquer foto para abrir em tela cheia.</p>
                </div>
              </Reveal>

              <Reveal delay={120} className="mt-10">
                <PropertyGallery images={fotos} name={property.name} />
              </Reveal>
            </section>
          )}

          {/* Localização */}
          <section id="localizacao" className="scroll-mt-32 pb-section">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="eyebrow">Localização</p>
                  <h2 className="display mt-6 text-[2rem] lg:text-[2.5rem]">
                    {property.district}, {property.city}.
                  </h2>
                </div>
                <Link
                  href={`/imoveis?bairro=${encodeURIComponent(property.district)}`}
                  className="tap underline-grow text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-graphite"
                >
                  Ver outros imóveis neste bairro
                </Link>
              </div>
            </Reveal>

            <Reveal delay={120} className="mt-10">
              <PropertyMap
                district={property.district}
                city={property.city}
                state={site.contact.address.state}
              />
            </Reveal>
          </section>
        </div>

        {/* Outros imóveis */}
        {others.length > 0 && (
          <section id="similares" className="scroll-mt-32 bg-cream-deep/60 py-section">
            <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
              <Reveal>
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <h2 className="display text-[2rem] lg:text-[2.5rem]">Outros imóveis do portfólio</h2>
                  <Link
                    href="/imoveis"
                    className="tap border-b border-graphite/25 pb-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-deep"
                  >
                    Ver todos
                  </Link>
                </div>
              </Reveal>

              <div className="mt-14 grid items-stretch gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                <RevealGroup variant="up" step={100}>
                  {others.map((item) => (
                    <PropertyCard key={item.slug} property={item} />
                  ))}
                </RevealGroup>
              </div>
            </div>
          </section>
        )}

        {/* Espaço para a barra fixa do mobile não cobrir o rodapé. */}
        <div aria-hidden="true" className="h-20 lg:hidden" />
      </main>

      <Footer />
      <WhatsAppFloat hideOnMobile />
      <PropertyActionBar property={property} />
    </>
  )
}
