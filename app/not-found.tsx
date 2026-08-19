import Link from "next/link"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="conteudo" className="grid min-h-[70vh] place-items-center px-6 pt-32">
        <div className="max-w-md text-center">
          <p className="eyebrow justify-center before:hidden">Erro 404</p>
          <h1 className="display mt-6 text-[2.5rem] lg:text-[3rem]">Esta página não existe.</h1>
          <p className="mt-6 text-muted">
            O endereço pode ter mudado ou o imóvel já foi negociado. Veja o portfólio atual ou fale
            com um consultor.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/imoveis"
              className="bg-graphite px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold"
            >
              Ver imóveis
            </Link>
            <Link
              href="/"
              className="border border-graphite/25 px-8 py-4 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-graphite"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
