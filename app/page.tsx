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

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <FeaturedProperties />
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
