import type { Property } from "@/lib/properties"

/**
 * Linha de ícones com as medidas do imóvel.
 *
 * Texto corrido ("4 suítes · 620 m²") obriga a ler; o ícone é reconhecido de
 * relance, que é como as pessoas varrem uma grade de imóveis. Os dois sites de
 * referência usam esse padrão.
 */
export function PropertySpecs({
  property,
  size = "sm",
  className = "",
}: {
  property: Pick<Property, "area" | "bedrooms" | "suites" | "parking">
  size?: "sm" | "md"
  className?: string
}) {
  const specs = [
    { icon: <AreaIcon />, value: `${property.area}`, unit: "m²", label: "Área" },
    { icon: <BedIcon />, value: `${property.bedrooms}`, label: property.bedrooms === 1 ? "quarto" : "quartos" },
    { icon: <BathIcon />, value: `${property.suites}`, label: property.suites === 1 ? "suíte" : "suítes" },
    { icon: <CarIcon />, value: `${property.parking}`, label: property.parking === 1 ? "vaga" : "vagas" },
  ].filter((spec) => spec.value !== "0")

  const text = size === "md" ? "text-[12px]" : "text-[11px]"
  const box = size === "md" ? "size-4" : "size-3.5"

  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${text} text-muted ${className}`}>
      {specs.map((spec) => (
        <li key={spec.label} className="inline-flex items-center gap-1.5">
          <span className={`${box} shrink-0 text-gold`} aria-hidden="true">
            {spec.icon}
          </span>
          <span className="text-graphite">
            {spec.value}
            {spec.unit && <span className="text-muted"> {spec.unit}</span>}
          </span>
          {/* Com unidade, o rótulo existe só para leitor de tela ("620 m²" já se
              explica visualmente). Sem unidade, o próprio rótulo é o texto
              visível — renderizar os dois faria o leitor dizer "4 quartos quartos". */}
          {spec.unit ? <span className="sr-only">{spec.label}</span> : <span>{spec.label}</span>}
        </li>
      ))}
    </ul>
  )
}

/* Ícones em traço fino, para acompanhar o peso da tipografia do site. */

function AreaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-full">
      <path d="M3 3h18v18H3z" />
      <path d="M3 9h6M9 3v6" opacity=".55" />
    </svg>
  )
}

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-full">
      <path d="M2 17v-5a2 2 0 012-2h16a2 2 0 012 2v5M2 17h20M2 17v3M22 17v3" />
      <path d="M6 10V7a1 1 0 011-1h10a1 1 0 011 1v3" />
    </svg>
  )
}

function BathIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-full">
      <path d="M3 12h18v2a5 5 0 01-5 5H8a5 5 0 01-5-5v-2z" />
      <path d="M6 12V5.5A2.5 2.5 0 018.5 3 2.5 2.5 0 0111 5.5" />
      <path d="M9.5 6.5h3" />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-full">
      <path d="M4 16v2M20 16v2" />
      <path d="M3 16v-3.2a2 2 0 01.2-.9l1.9-3.7A2 2 0 016.9 7h10.2a2 2 0 011.8 1.1l1.9 3.7c.1.3.2.6.2.9V16H3z" />
      <path d="M6.5 13h1M16.5 13h1" />
    </svg>
  )
}
