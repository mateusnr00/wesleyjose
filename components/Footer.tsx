import Link from "next/link"
import { Logo } from "./Logo"
import { nav, site, whatsappLink } from "@/lib/site"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink py-20 text-cream/70">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Logo tone="light" />
            <p className="mt-7 max-w-xs text-[13px] leading-relaxed">
              Consultoria imobiliária de alto padrão em Goiânia. Curadoria, discrição e estratégia em
              cada negociação.
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-cream/40">
              {site.founder.creci}
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="text-[9px] uppercase tracking-[0.22em] text-cream/40">Navegação</h2>
            <ul className="mt-6 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[13px] transition-colors hover:text-gold-soft">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[9px] uppercase tracking-[0.22em] text-cream/40">Contato</h2>
            <ul className="mt-6 space-y-3 text-[13px]">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold-soft">
                  {site.contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-gold-soft">
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-soft"
                >
                  {site.social.instagramHandle}
                </a>
              </li>
              <li className="pt-2 text-cream/45">
                {site.contact.address.district} · {site.contact.address.city}/{site.contact.address.state}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-cream/10 pt-8 text-[11px] text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Todos os direitos reservados.
          </p>
          <p>As imagens e valores exibidos podem sofrer alteração sem aviso prévio.</p>
        </div>
      </div>
    </footer>
  )
}
