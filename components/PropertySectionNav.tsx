"use client"

import { useEffect, useState } from "react"

const secoes = [
  { id: "sobre", label: "O imóvel" },
  { id: "galeria", label: "Galeria" },
  { id: "localizacao", label: "Localização" },
  { id: "similares", label: "Similares" },
]

/**
 * Índice fixo que marca em que trecho da página o leitor está.
 *
 * Página de imóvel é longa e cheia de blocos distintos; sem isso, quem quer só
 * ver a localização precisa rolar procurando. Usa IntersectionObserver com uma
 * faixa estreita no meio da tela, para a marcação não piscar entre seções.
 */
export function PropertySectionNav() {
  const [ativa, setAtiva] = useState<string>(secoes[0].id)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const alvos = secoes
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entradas) => {
        const dentro = entradas.filter((e) => e.isIntersecting)
        if (dentro.length > 0) setAtiva(dentro[0].target.id)
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )

    alvos.forEach((el) => observer.observe(el))

    // Só aparece depois do hero, para não competir com ele.
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <nav
      aria-label="Seções do imóvel"
      className={`sticky top-[68px] z-30 -mx-6 mb-14 border-y border-line bg-cream/92 backdrop-blur-md transition-opacity duration-500 lg:-mx-12 ${
        visivel ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <ul className="mx-auto flex max-w-[1360px] gap-6 overflow-x-auto px-6 py-3.5 lg:gap-9 lg:px-12">
        {secoes.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={ativa === s.id ? "true" : undefined}
              className={`tap whitespace-nowrap text-[11px] uppercase tracking-[0.18em] transition-colors ${
                ativa === s.id ? "text-graphite" : "text-muted hover:text-graphite"
              }`}
            >
              {s.label}
              <span
                aria-hidden="true"
                className={`mt-1.5 block h-px origin-left transition-transform duration-500 ${
                  ativa === s.id ? "scale-x-100 bg-gold" : "scale-x-0 bg-transparent"
                }`}
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
