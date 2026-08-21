import { About } from "@/components/About"
import { Clients } from "@/components/Clients"
import { Contact } from "@/components/Contact"
import { DistrictShortcuts } from "@/components/DistrictShortcuts"
import { FeaturedProperties } from "@/components/FeaturedProperties"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { Newsletter } from "@/components/Newsletter"
import { PathCards } from "@/components/PathCards"
import { ScrollProgress } from "@/components/Reveal"
import { SellCta } from "@/components/SellCta"
import { Services } from "@/components/Services"
import { Testimonials } from "@/components/Testimonials"
import { WhatsAppFloat } from "@/components/WhatsAppFloat"
import { getSiteContent, list, t } from "@/lib/content"
import { districtsOf } from "@/lib/properties"
import { getFeaturedProperties, getProperties } from "@/lib/queries"

/**
 * Estática, revalidada de hora em hora. As alterações feitas no painel não
 * esperam esse prazo: as server actions chamam revalidatePath ao salvar.
 */
export const revalidate = 3600

export default async function HomePage() {
  const [all, featured, c] = await Promise.all([getProperties(), getFeaturedProperties(), getSiteContent()])

  return (
    <>
      <ScrollProgress />
      <Header overHero />
      <main id="conteudo">
        <Hero
          block={c.blocks.home_hero}
          stats={list(c, "estatisticas")}
          estados={list(c, "estados")}
          spotlight={featured[0]}
          districts={districtsOf(all)}
        />
        {/* A bifurcação vem cedo: quem quer vender não precisa deduzir que é atendido. */}
        <PathCards block={c.blocks.home_caminhos} paths={list(c, "caminhos")} />
        <About block={c.blocks.home_sobre} pillars={list(c, "pilares")} />
        {featured.length > 0 && <FeaturedProperties block={c.blocks.home_portfolio} properties={featured} />}
        <DistrictShortcuts block={c.blocks.home_bairros} properties={all} />
        <Services block={c.blocks.home_consultoria} services={list(c, "consultoria")} />
        <SellCta block={c.blocks.home_vendedores} />
        <Testimonials block={c.blocks.home_depoimentos} items={list(c, "depoimentos")} />
        <Clients block={c.blocks.home_clientes} items={list(c, "clientes")} />
        <Newsletter block={c.blocks.home_boletim} />
        <Contact block={c.blocks.home_contato} interests={list(c, "contato_interesses")} />
      </main>
      <Footer text={t(c, "rodape", "text")} legal={t(c, "rodape", "legal")} estados={list(c, "estados")} />
      <WhatsAppFloat />
    </>
  )
}
