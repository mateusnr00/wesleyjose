"use client"

import { useEffect, useRef, useState } from "react"

/** Separa "R$ 380M" em prefixo, número e sufixo, para animar só o número. */
function parse(value: string) {
  const match = value.match(/^(\D*?)([\d.,]+)(.*)$/s)
  if (!match) return null

  const [, prefix, digits, suffix] = match
  const target = Number(digits.replace(/\./g, "").replace(",", "."))
  if (!Number.isFinite(target)) return null

  const decimals = digits.includes(",") ? digits.split(",")[1].length : 0
  return { prefix, target, suffix, decimals }
}

/**
 * Conta até o número quando ele entra na viewport.
 *
 * O valor final é renderizado no servidor e só então substituído pela
 * animação: se o JS não rodar, ou o usuário pedir menos movimento, o número
 * correto já está na tela.
 */
export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const parsed = parse(value)
  const [display, setDisplay] = useState(value)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || !parsed) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const format = (n: number) =>
          n.toLocaleString("pt-BR", {
            minimumFractionDigits: parsed.decimals,
            maximumFractionDigits: parsed.decimals,
          })

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          // easeOutExpo: acelera na entrada e assenta no fim, sem parecer linear.
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
          setDisplay(`${parsed.prefix}${format(parsed.target * eased)}${parsed.suffix}`)
          if (progress < 1) requestAnimationFrame(tick)
        }

        setDisplay(`${parsed.prefix}${format(0)}${parsed.suffix}`)
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )

    observer.observe(node)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}
