import type { Metadata } from "next"
import { Suspense } from "react"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { PropertyCatalog } from "@/components/PropertyCatalog"
import { WhatsAppFloat } from "@/components/WhatsAppFloat"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Imóveis à venda em Goiânia",
  description:
    "Catálogo de residências, coberturas, apartamentos e lançamentos de alto padrão em Goiânia, com filtro por bairro, tipo e faixa de valor.",
}

export default function PropertiesPage() {
  return (
    <>
      <Header />

      <main id="conteudo" className="pt-36 lg:pt-44">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
          <p className="eyebrow">Portfólio</p>

          <h1 className="display mt-7 max-w-2xl text-[2.5rem] lg:text-[3.5rem]">
            Imóveis de alto padrão em <em>Goiânia</em>.
          </h1>

          <p className="mt-7 max-w-lg text-muted">
            O que está aqui já passou pela nossa verificação. O que não está — e é boa parte —
            está em negociação reservada: fale com a {site.name} para saber.
          </p>

          <div className="mt-14 pb-24">
            <Suspense fallback={<p className="py-20 text-center text-[11px] uppercase tracking-[0.2em] text-muted">Carregando…</p>}>
              <PropertyCatalog />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  )
}
