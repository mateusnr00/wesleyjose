import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { PropertyCard } from "@/components/PropertyCard"
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

  const specs = [
    { label: "Área", value: `${property.area} m²` },
    { label: "Quartos", value: String(property.bedrooms) },
    { label: "Suítes", value: String(property.suites) },
    { label: "Vagas", value: String(property.parking) },
  ]

  return (
    <>
      <ScrollProgress />
      <Header />

      <main id="conteudo" className="pt-32 lg:pt-40">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
          <nav aria-label="Trilha de navegação" className="text-[11px] uppercase tracking-[0.18em] text-muted">
            <Link href="/" className="tap hover:text-graphite">
              Início
            </Link>
            <span className="mx-3" aria-hidden="true">
              /
            </span>
            <Link href="/imoveis" className="tap hover:text-graphite">
              Imóveis
            </Link>
            <span className="mx-3" aria-hidden="true">
              /
            </span>
            <span className="text-graphite">{property.name}</span>
          </nav>

          <header className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-graphite px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-cream">
                  {kindLabels[property.kind]}
                </span>
                <span className="border border-line px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-muted">
                  {statusLabels[property.status]}
                </span>
                <span className="ml-auto text-[10px] tracking-[0.18em] text-muted-light">
                  Ref. {property.reference}
                </span>
              </div>

              <h1 className="display mt-6 text-[2.5rem] lg:text-[3.5rem]">{property.name}</h1>
              <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted">
                {property.district} · {property.city}/{site.contact.address.state}
              </p>
            </div>

            <p className="display text-3xl lg:text-4xl">{formatPrice(property.price)}</p>
          </header>
        </div>

        {/* Galeria: destaque grande + secundárias */}
        <div className="mx-auto mt-12 max-w-[1360px] px-6 lg:px-12">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Reveal variant="clip" duration={1200} className="relative aspect-[4/3] w-full overflow-hidden bg-cream-deep lg:aspect-[3/2]">
              <Image
                src={property.image || placeholderImage}
                unoptimized={!property.image}
                alt={`${property.name}, fachada`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </Reveal>

            <div className="grid gap-3">
              {property.gallery.slice(0, 2).map((src, index) => (
                <Reveal
                  key={src}
                  variant="clip"
                  duration={1200}
                  delay={150 + index * 150}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-cream-deep"
                >
                  <Image
                    src={src}
                    alt={`${property.name}, ambiente ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo + painel de contato */}
        <div className="mx-auto max-w-[1360px] px-6 py-24 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-24">
            <div>
              <p className="display max-w-xl text-2xl leading-snug lg:text-[1.75rem]">{property.headline}</p>

              <dl className="mt-12 grid grid-cols-2 gap-8 border-y border-line py-8 sm:grid-cols-4">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-[9px] uppercase tracking-[0.2em] text-muted">{spec.label}</dt>
                    <dd className="display mt-2 text-2xl">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-12 max-w-xl">
                <h2 className="text-[9px] uppercase tracking-[0.22em] text-muted">Sobre o imóvel</h2>
                <p className="mt-5 text-muted">{property.description}</p>
              </div>

              <div className="mt-12 max-w-xl">
                <h2 className="text-[9px] uppercase tracking-[0.22em] text-muted">Diferenciais</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {property.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[13px]">
                      <span className="mt-2 size-1 shrink-0 bg-gold" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="border border-line p-8">
                <p className="eyebrow before:hidden">Agende uma visita</p>

                <p className="mt-5 text-[13px] text-muted">
                  Visitas são agendadas com a presença de um consultor e ajustadas ao seu horário,
                  inclusive fora do comercial.
                </p>

                <a
                  href={whatsappLink(
                    `Olá! Tenho interesse no imóvel "${property.name}" (${property.district}) que vi no site da ${site.name}. Podemos conversar?`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 block bg-graphite px-6 py-4 text-center text-[10px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold"
                >
                  Falar sobre este imóvel
                </a>

                <a
                  href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`Interesse: ${property.name}`)}`}
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
        </div>

        {/* Outros imóveis */}
        <section className="bg-cream-deep/60 py-section">
          <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="display text-[2rem] lg:text-[2.5rem]">Outros imóveis do portfólio</h2>
              <Link
                href="/imoveis"
                className="border-b border-graphite/25 pb-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-deep"
              >
                Ver todos
              </Link>
            </div>

            <div className="mt-14 grid items-stretch gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              <RevealGroup variant="up" step={100}>
                {others.map((item) => (
                  <PropertyCard key={item.slug} property={item} />
                ))}
              </RevealGroup>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  )
}
