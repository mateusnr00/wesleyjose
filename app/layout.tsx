import type { Metadata } from "next"
import { site } from "@/lib/site"
import { baseUrl } from "@/lib/url"
import "./globals.css"

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/*
          Fontes por <link> em vez de next/font: o ambiente de build não tem
          acesso de rede ao Google Fonts. Trocar por next/font quando publicar
          reduz o CLS e elimina o request externo.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-navy focus:px-4 focus:py-2 focus:text-xs focus:tracking-[0.2em] focus:text-white focus:uppercase"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  )
}
