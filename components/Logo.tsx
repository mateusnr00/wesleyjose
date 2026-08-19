import Link from "next/link"
import { site } from "@/lib/site"

/** Monograma + assinatura. `tone` acompanha o fundo da seção. */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const text = tone === "light" ? "text-white" : "text-graphite"

  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${text}`} aria-label={`${site.name} — página inicial`}>
      <span className="relative grid size-9 shrink-0 place-items-center">
        <svg viewBox="0 0 40 40" className="absolute inset-0 size-full text-gold" aria-hidden="true">
          <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
        </svg>
        <span className="font-[family-name:var(--font-display)] text-[15px] leading-none">P</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-[family-name:var(--font-display)] text-lg tracking-wide">{site.name}</span>
        <span className="mt-1 text-[8px] uppercase tracking-[0.3em] opacity-55">Goiânia · GO</span>
      </span>
    </Link>
  )
}
