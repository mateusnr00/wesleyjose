"use client"

import Link from "next/link"
import { useSite } from "./SiteContext"

/** Monograma + assinatura. `tone` acompanha o fundo da seção. */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const site = useSite()
  const text = tone === "light" ? "text-white" : "text-graphite"

  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${text}`}>
      <span className="relative grid size-9 shrink-0 place-items-center">
        <svg viewBox="0 0 40 40" className="absolute inset-0 size-full text-gold" aria-hidden="true">
          <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
        </svg>
        <span aria-hidden="true" className="font-[family-name:var(--font-display)] text-[15px] font-light leading-none">P</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-[family-name:var(--font-display)] text-lg font-light tracking-wide">{site.name}</span>
        <span className="mt-1 text-[9px] uppercase tracking-[0.3em] opacity-80">
          {site.city} · {site.state}
        </span>
      </span>
    </Link>
  )
}
