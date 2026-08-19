"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Logo } from "./Logo"
import { nav, site, whatsappLink } from "@/lib/site"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Trava o scroll do corpo enquanto o menu mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cream/92 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-8 px-6 py-5 lg:px-12">
        <Logo />

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Navegação principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-[11px] uppercase tracking-[0.18em] text-graphite/75 transition-colors hover:text-graphite after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
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
            className="hidden border border-graphite/25 px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-graphite hover:bg-graphite hover:text-cream sm:inline-block"
          >
            Falar com consultor
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 block h-px w-full bg-graphite transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-graphite transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Menu mobile em tela cheia */}
      <div
        id="menu-mobile"
        className={`fixed inset-0 top-[76px] bg-cream transition-all duration-400 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex flex-col px-6 pt-6" aria-label="Navegação mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="display border-b border-line py-5 text-3xl"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappLink(`Olá! Vim pelo site da ${site.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 bg-graphite px-6 py-4 text-center text-[10px] uppercase tracking-[0.2em] text-cream"
          >
            Falar no WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}
