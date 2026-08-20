"use client"

import Link from "next/link"
import { Logo } from "./Logo"
import { useSite } from "./SiteContext"
import { waLink } from "@/lib/whatsapp"

export function Footer({ text, legal }: { text: string; legal: string }) {
  const site = useSite()
  const nav = site.nav
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink py-20 text-cream/70">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Logo tone="light" />
            <p className="mt-7 max-w-xs text-[13px] leading-relaxed">{text}</p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-cream/55">
              {site.creci}
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="text-[9px] uppercase tracking-[0.22em] text-cream/55">Navegação</h2>
            <ul className="mt-6 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="tap text-[13px] transition-colors hover:text-gold-soft">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[9px] uppercase tracking-[0.22em] text-cream/55">Contato</h2>
            <ul className="mt-6 space-y-3 text-[13px]">
              <li>
                <a href={waLink(site.whatsapp)} target="_blank" rel="noopener noreferrer" className="tap transition-colors hover:text-gold-soft">
                  {site.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="tap transition-colors hover:text-gold-soft">
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap transition-colors hover:text-gold-soft"
                >
                  {site.instagramHandle}
                </a>
              </li>
              <li className="pt-2 text-cream/55">
                {site.district} · {site.city}/{site.state}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-cream/10 pt-8 text-[12px] text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Todos os direitos reservados.
          </p>
          <p>{legal}</p>
        </div>
      </div>
    </footer>
  )
}
