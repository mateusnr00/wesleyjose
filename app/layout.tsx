import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import { site } from "@/lib/site"
import { baseUrl } from "@/lib/url"
import "./globals.css"

/**
 * Fontes servidas pelo próprio domínio.
 *
 * Antes vinham por <link> para o Google Fonts, o que custava uma folha de
 * estilo render-blocking, um request a um terceiro e — pior — deixava o texto
 * trocando de fonte até a resposta chegar. next/font baixa os arquivos no
 * build, embute o @font-face e adiciona métricas de fallback, o que zera o
 * deslocamento de layout.
 */
/*
 * Só os pesos que o CSS de fato usa. Declarar a família inteira gerava 17
 * arquivos (500 KB) no caminho crítico; hoje são quatro.
 * `latin` basta para o português — os acentos vivem nesse intervalo, e
 * `latin-ext` só acrescenta caracteres do leste europeu.
 */
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display-loaded",
})

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
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
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
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
