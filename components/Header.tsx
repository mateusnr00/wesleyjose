"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Logo } from "./Logo"
import { nav, site, whatsappLink } from "@/lib/site"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Navegar fecha o menu. Sem isso, ir para /imoveis deixaria o painel aberto
  // por cima da página nova.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        return
      }

      // Prende o Tab dentro do painel: sem isso o foco sai para os links da
      // página que está atrás do overlay.
      if (event.key !== "Tab") return

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables?.length) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    // Leva o foco para dentro assim que abre.
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus()

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  function close() {
    setOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <>
      <header
        // O header cria o próprio contexto de empilhamento, então o z-index do
        // botão só vale dentro dele: para o X ficar acima do painel, quem sobe
        // é o header inteiro.
        className={`fixed inset-x-0 top-0 transition-all duration-500 ${open ? "z-[80]" : "z-50"} ${
          scrolled && !open ? "bg-cream/92 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-8 px-6 py-5 lg:px-12">
          {/* Escondido enquanto o painel está aberto: o painel tem a sua própria
              marca no topo, e duas logos sobrepostas ficavam confusas. */}
          <div className={`transition-opacity duration-200 ${open ? "pointer-events-none opacity-0" : "opacity-100"}`}>
            <Logo />
          </div>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Navegação principal">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative py-1.5 text-[11px] uppercase tracking-[0.18em] text-graphite/75 transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:text-graphite hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={whatsappLink(`Olá! Vim pelo site da ${site.name} e gostaria de falar com um consultor.`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden border border-graphite/25 px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition-all hover:border-graphite hover:bg-graphite hover:text-cream lg:inline-block ${
                open ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              Falar com consultor
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => (open ? close() : setOpen(true))}
              className="relative -mr-2 grid size-11 place-items-center lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
              <span className="relative block h-3.5 w-6">
                <span
                  className={`absolute left-0 block h-px w-full bg-graphite transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-px w-full bg-graphite transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-graphite transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "top-1.5 -rotate-45" : "top-3.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/*
        Painel em tela cheia, revelado por clip-path a partir da direita.
        O fundo é opaco desde o primeiro quadro — animar a opacidade do painel
        inteiro deixava a página aparecendo por trás durante a transição.
      */}
      <div
        id="menu-mobile"
        ref={panelRef}
        inert={!open}
        aria-hidden={!open}
        className="fixed inset-0 z-[70] bg-cream transition-[clip-path] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden"
        style={{ clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 0 100%)" }}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-10 pt-5">
          <div className="flex items-center justify-between">
            <Logo />
            {/* Espaço reservado para o botão de fechar, que vive no header. */}
            <span className="size-11" aria-hidden="true" />
          </div>

          <nav className="mt-10 flex flex-col" aria-label="Navegação principal">
            {nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="group flex items-baseline gap-5 border-b border-line py-5 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  // Escalonado só na abertura; ao fechar tudo sai junto, senão
                  // o menu demora a sumir.
                  transitionDelay: open ? `${160 + index * 65}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "none" : "translateY(1rem)",
                }}
              >
                <span className="text-[10px] tracking-[0.2em] text-gold-deep">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="display text-3xl transition-colors group-hover:text-gold-deep">{item.label}</span>
                <span
                  aria-hidden="true"
                  className="ml-auto self-center text-muted-light transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            ))}
          </nav>

          <div
            className="mt-auto pt-10 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transitionDelay: open ? `${160 + nav.length * 65}ms` : "0ms",
              opacity: open ? 1 : 0,
              transform: open ? "none" : "translateY(1rem)",
            }}
          >
            <a
              href={whatsappLink(`Olá! Vim pelo site da ${site.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-graphite px-6 py-4 text-center text-[10px] uppercase tracking-[0.2em] text-cream"
            >
              Falar no WhatsApp
            </a>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted">
              <a href={`mailto:${site.contact.email}`} className="tap hover:text-graphite">
                {site.contact.email}
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="tap hover:text-graphite"
              >
                {site.social.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
