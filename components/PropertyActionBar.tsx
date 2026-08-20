"use client"

import { useEffect, useState } from "react"
import { formatPrice, type Property } from "@/lib/properties"
import { useSite } from "./SiteContext"
import { waLink } from "@/lib/whatsapp"

/**
 * Barra fixa no rodapé, só no mobile.
 *
 * No celular o preço e o botão de contato saem da tela nas primeiras rolagens
 * e não voltam mais. Esta barra devolve os dois em qualquer ponto da página,
 * que é onde a conversão acontece.
 */
export function PropertyActionBar({ property }: { property: Property }) {
  const site = useSite()
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/96 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
        visivel ? "translate-y-0" : "translate-y-full"
      }`}
      // O botão flutuante de WhatsApp sobe para não ficar sob esta barra.
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="min-w-0">
          <span className="block text-[9px] uppercase tracking-[0.2em] text-muted">{property.reference}</span>
          <span className="display block truncate text-lg leading-tight">{formatPrice(property.price)}</span>
        </div>

        <a
          href={waLink(site.whatsapp, 
            `Olá! Tenho interesse no imóvel "${property.name}" (${property.reference}) que vi no site da ${site.name}.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-graphite px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] text-cream"
        >
          Falar agora
        </a>
      </div>
    </div>
  )
}
