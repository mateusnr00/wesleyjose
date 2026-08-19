"use client"

import { useEffect, useRef } from "react"

export type RevealVariant = "up" | "down" | "left" | "right" | "scale" | "fade" | "clip"

/**
 * Revela o conteúdo quando ele entra na viewport.
 *
 * Sem JS, ou com `prefers-reduced-motion`, o conteúdo já nasce visível: o CSS
 * que esconde vive dentro da media query de movimento. Isso evita a falha
 * clássica de bibliotecas tipo AOS, onde a página fica em branco se o script
 * não carregar.
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration,
  once = true,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode
  variant?: RevealVariant
  delay?: number
  duration?: number
  /** `false` faz o elemento animar de novo toda vez que reentra na viewport. */
  once?: boolean
  className?: string
  as?: "div" | "section" | "li" | "span"
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.dataset.visible = "true"
          if (once) observer.disconnect()
        } else if (!once) {
          delete node.dataset.visible
        }
      },
      // threshold 0: a variante "clip" nasce com clip-path zerando a área
      // pintada, então exigir uma fração visível deixava o elemento preso.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      // @ts-expect-error -- ref polimórfico entre os elementos aceitos em `as`
      ref={ref}
      className={`reveal ${className}`}
      data-reveal={variant}
      style={{
        transitionDelay: `${delay}ms`,
        ...(duration ? { transitionDuration: `${duration}ms` } : {}),
      }}
    >
      {children}
    </Tag>
  )
}

/**
 * Aplica o mesmo reveal a cada filho, escalonando o atraso.
 *
 * Escalonar é o que faz uma grade parecer intencional em vez de um bloco que
 * pisca inteiro. O atraso é limitado para que listas longas não deixem os
 * últimos itens esperando meio segundo depois de já estarem na tela.
 */
export function RevealGroup({
  children,
  variant = "up",
  step = 90,
  maxDelay = 450,
  initialDelay = 0,
  className = "",
}: {
  children: React.ReactNode
  variant?: RevealVariant
  step?: number
  maxDelay?: number
  initialDelay?: number
  className?: string
}) {
  const items = Array.isArray(children) ? children : [children]

  return (
    <>
      {items.map((child, index) => (
        <Reveal
          key={index}
          variant={variant}
          delay={Math.min(initialDelay + index * step, initialDelay + maxDelay)}
          className={className}
        >
          {child}
        </Reveal>
      ))}
    </>
  )
}

/** Barra fina no topo indicando o progresso de leitura da página. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let frame = 0
    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      node.style.transform = `scaleX(${Math.min(progress, 1)})`
    }

    // rAF para não recalcular layout a cada evento de scroll.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px" aria-hidden="true">
      <div ref={ref} className="h-full origin-left scale-x-0 bg-gold transition-transform duration-150" />
    </div>
  )
}
