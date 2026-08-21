import type { Metadata } from "next"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { ScrollProgress } from "@/components/Reveal"
import { PropertyCatalog } from "@/components/PropertyCatalog"
import { WhatsAppFloat } from "@/components/WhatsAppFloat"
import { Destaque } from "@/components/Destaque"
import { getSiteContent, list, t } from "@/lib/content"
import { getProperties } from "@/lib/queries"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent()
  return {
    title: "Imóveis à venda em Goiânia",
    description: t(c, "imoveis_topo", "text"),
  }
}

export default async function PropertiesPage() {
  const [properties, c] = await Promise.all([getProperties(), getSiteContent()])

  return (
    <>
      <ScrollProgress />
      <Header />

      <main id="conteudo" className="pt-36 lg:pt-44">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
          <p className="eyebrow">{t(c, "imoveis_topo", "eyebrow")}</p>

          <h1 className="display mt-7 max-w-2xl text-[2.5rem] lg:text-[3.5rem]">
            <Destaque>{t(c, "imoveis_topo", "title")}</Destaque>
          </h1>

          <p className="mt-7 max-w-lg text-muted">
{t(c, "imoveis_topo", "text")}
          </p>

          <div className="mt-14 pb-24">
            <PropertyCatalog properties={properties} />
          </div>
        </div>
      </main>

      <Footer text={t(c, "rodape", "text")} legal={t(c, "rodape", "legal")} estados={list(c, "estados")} />
      <WhatsAppFloat />
    </>
  )
}
