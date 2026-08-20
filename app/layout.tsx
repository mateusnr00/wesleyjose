import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { SiteProvider } from "@/components/SiteContext"
import { getSiteContent, siteData } from "@/lib/content"
import { baseUrl } from "@/lib/url"
import "./globals.css"

/**
 * Uma família só, servida pelo próprio domínio, na versão variável: um
 * arquivo cobre todos os pesos, o que sai menor que vários estáticos.
 *
 * Antes as fontes vinham por <link> para o Google Fonts, o que custava uma
 * folha render-blocking e deixava o texto trocando de fonte até a resposta
 * chegar. next/font baixa no build, embute o @font-face e ajusta as métricas
 * de fallback, zerando o deslocamento de layout.
 *
 * A Cormorant Garamond, que fazia os títulos, saiu por um defeito concreto:
 * ela desenha o circunflexo de "ê" e "â" solto e alto demais, então
 * "Residência" e "Goiânia", que aparecem em quase todo título deste site,
 * saíam com o acento descolado da letra. Não é o subconjunto de caracteres:
 * testei com latin-ext e o desenho é o mesmo. A hierarquia que a serifa fazia
 * passou a ser peso e tamanho.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-loaded",
})

/** Título e descrição também são editáveis, então a metadata é gerada. */
export async function generateMetadata(): Promise<Metadata> {
  const s = siteData(await getSiteContent())

  return {
    metadataBase: new URL(baseUrl()),
    title: {
      default: `${s.name} · ${s.tagline}`,
      template: `%s · ${s.name}`,
    },
    description: s.description,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: baseUrl(),
      siteName: s.name,
      title: `${s.name} · ${s.tagline}`,
      description: s.description,
    },
    robots: { index: true, follow: true },
  }
}

export const viewport = {
  themeColor: "#f7f4ee",
  colorScheme: "light",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = siteData(await getSiteContent())

  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-navy focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <SiteProvider value={s}>{children}</SiteProvider>
      </body>
    </html>
  )
}
