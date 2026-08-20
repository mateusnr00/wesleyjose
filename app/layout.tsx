import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { site } from "@/lib/site"
import { baseUrl } from "@/lib/url"
import "./globals.css"

/**
 * Uma família só, servida pelo próprio domínio, na versão variável — um
 * arquivo cobre todos os pesos, o que sai menor que vários estáticos.
 *
 * Antes as fontes vinham por <link> para o Google Fonts, o que custava uma
 * folha render-blocking e deixava o texto trocando de fonte até a resposta
 * chegar. next/font baixa no build, embute o @font-face e ajusta as métricas
 * de fallback, zerando o deslocamento de layout.
 *
 * A Cormorant Garamond, que fazia os títulos, saiu por um defeito concreto:
 * ela desenha o circunflexo de "ê" e "â" solto e alto demais, então
 * "Residência" e "Goiânia" — que aparecem em quase todo título deste site —
 * saíam com o acento descolado da letra. Não é o subconjunto de caracteres:
 * testei com latin-ext e o desenho é o mesmo. A hierarquia que a serifa fazia
 * passou a ser peso e tamanho.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-loaded",
})

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl()),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: baseUrl(),
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
}

export const viewport = {
  themeColor: "#f7f4ee",
  colorScheme: "light",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-navy focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-white"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  )
}
