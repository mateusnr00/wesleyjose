import { About } from "@/components/About"
import { Contact } from "@/components/Contact"
import { FeaturedProperties } from "@/components/FeaturedProperties"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { Newsletter } from "@/components/Newsletter"
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
      <Header />
      <main id="conteudo">
        <Hero spotlight={featured[0]} districts={districtsOf(all)} />
        <About />
        {featured.length > 0 && <FeaturedProperties properties={featured} />}
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
