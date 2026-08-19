import { About } from "@/components/About"
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
import { districtsOf } from "@/lib/properties"
import { getFeaturedProperties, getProperties } from "@/lib/queries"

/**
 * Estática, revalidada de hora em hora. As alterações feitas no painel não
 * esperam esse prazo: as server actions chamam revalidatePath ao salvar.
 */
export const revalidate = 3600

export default async function HomePage() {
  const [all, featured] = await Promise.all([getProperties(), getFeaturedProperties()])

  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="conteudo">
        <Hero spotlight={featured[0]} districts={districtsOf(all)} />
        {/* A bifurcação vem cedo: quem quer vender não precisa deduzir que é atendido. */}
        <PathCards />
        <About />
        {featured.length > 0 && <FeaturedProperties properties={featured} />}
        <DistrictShortcuts properties={all} />
        <Services />
        <SellCta />
        <Testimonials />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
