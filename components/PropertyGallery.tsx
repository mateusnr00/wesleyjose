"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { placeholderImage } from "@/lib/properties"

/**
 * Galeria com visor em tela cheia.
 *
 * Foto é o que vende imóvel de alto padrão, e miniatura de 200px não mostra
 * acabamento. O visor abre no tamanho da tela, anda por teclado e por arrasto,
 * e devolve o foco à miniatura de origem ao fechar.
 */
export function PropertyGallery({ images, name }: { images: string[]; name: string }) {
  const [aberta, setAberta] = useState<number | null>(null)
  const origem = useRef<HTMLButtonElement | null>(null)
  const visorRef = useRef<HTMLDivElement>(null)
  const toqueX = useRef<number | null>(null)

  const fechar = useCallback(() => {
    setAberta(null)
    origem.current?.focus()
  }, [])

  const andar = useCallback(
    (passo: number) => {
      setAberta((atual) => {
        if (atual === null) return atual
        // Circular: da última volta para a primeira.
        return (atual + passo + images.length) % images.length
      })
    },
    [images.length],
  )

  useEffect(() => {
    if (aberta === null) return

    document.body.style.overflow = "hidden"

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar()
      else if (e.key === "ArrowRight") andar(1)
      else if (e.key === "ArrowLeft") andar(-1)
      else if (e.key === "Tab") {
        // Mantém o Tab dentro do visor.
        const focaveis = visorRef.current?.querySelectorAll<HTMLElement>("button")
        if (!focaveis?.length) return
        const primeiro = focaveis[0]
        const ultimo = focaveis[focaveis.length - 1]
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault()
          ultimo.focus()
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault()
          primeiro.focus()
        }
      }
    }

    document.addEventListener("keydown", onKey)
    visorRef.current?.querySelector("button")?.focus()

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKey)
    }
  }, [aberta, andar, fechar])

  if (images.length === 0) return null

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((src, i) => (
          <li key={src + i}>
            <button
              type="button"
              onClick={(e) => {
                origem.current = e.currentTarget
                setAberta(i)
              }}
              aria-label={`Abrir foto ${i + 1} de ${images.length} em tela cheia`}
              className="group relative block aspect-[4/3] w-full overflow-hidden bg-cream-deep"
            >
              <Image
                src={src || placeholderImage}
                alt=""
                fill
                unoptimized={!src}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-graphite/0 transition-colors duration-500 group-hover:bg-graphite/20" />
            </button>
          </li>
        ))}
      </ul>

      {aberta !== null && (
        <div
          ref={visorRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${name}, foto ${aberta + 1} de ${images.length}`}
          className="fixed inset-0 z-[90] flex flex-col bg-plum-deep/97"
          onTouchStart={(e) => {
            toqueX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (toqueX.current === null) return
            const delta = e.changedTouches[0].clientX - toqueX.current
            if (Math.abs(delta) > 45) andar(delta < 0 ? 1 : -1)
            toqueX.current = null
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 text-cream/80">
            <span className="text-[11px] uppercase tracking-[0.2em]">
              {aberta + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={fechar}
              aria-label="Fechar visualização"
              className="grid size-11 place-items-center text-2xl leading-none transition-colors hover:text-cream"
            >
              ×
            </button>
          </div>

          <div className="relative flex-1">
            <Image
              key={images[aberta]}
              src={images[aberta] || placeholderImage}
              alt={`${name}, foto ${aberta + 1}`}
              fill
              unoptimized={!images[aberta]}
              sizes="100vw"
              className="animate-[visor_450ms_cubic-bezier(0.16,1,0.3,1)] object-contain"
            />
          </div>

          {images.length > 1 && (
            <div className="flex items-center justify-between px-5 py-5">
              <button
                type="button"
                onClick={() => andar(-1)}
                className="tap text-[11px] uppercase tracking-[0.2em] text-cream/70 transition-colors hover:text-cream"
              >
                ← Anterior
              </button>
              <button
                type="button"
                onClick={() => andar(1)}
                className="tap text-[11px] uppercase tracking-[0.2em] text-cream/70 transition-colors hover:text-cream"
              >
                Próxima →
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
