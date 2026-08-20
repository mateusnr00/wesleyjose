"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

/**
 * Foto do topo com vídeo opcional em laço por cima.
 *
 * A ordem importa para o desempenho: a imagem é renderizada sempre, com
 * `priority`, e continua sendo o elemento de LCP. O vídeo é uma camada
 * adicional que só aparece depois de `canplay`, então ele nunca atrasa a
 * primeira pintura, e se falhar, demorar ou o navegador recusar o autoplay,
 * o que fica na tela é a foto.
 *
 * Não carrega vídeo quando o usuário pede menos movimento ou está com economia
 * de dados ligada: um laço decorativo não justifica o consumo nesses casos.
 */
export function HeroMedia({
  image,
  video,
  alt,
  className = "",
  unoptimized = false,
}: {
  image: string
  video?: string
  alt: string
  className?: string
  unoptimized?: boolean
}) {
  const [tocando, setTocando] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)
  const moldura = useRef<HTMLDivElement>(null)
  const [permitido, setPermitido] = useState(false)

  useEffect(() => {
    if (!video) return

    const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const conexao = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (menosMovimento || conexao?.saveData) return

    // Só começa a baixar depois que a página assentou, para o vídeo não
    // disputar banda com o que precisa aparecer primeiro.
    const id = window.setTimeout(() => setPermitido(true), 600)
    return () => window.clearTimeout(id)
  }, [video])

  // Pausa quando o topo sai da tela. Um laço decorativo rodando enquanto o
  // visitante lê o resto da página só gasta bateria e processamento.
  useEffect(() => {
    const alvo = moldura.current
    if (!alvo || !permitido) return

    const observer = new IntersectionObserver(
      ([entrada]) => {
        const v = ref.current
        if (!v) return
        if (entrada.isIntersecting) void v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.15 },
    )

    observer.observe(alvo)
    return () => observer.disconnect()
  }, [permitido])

  return (
    <div ref={moldura} className="absolute inset-0">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        unoptimized={unoptimized}
        sizes="(max-width: 1024px) 100vw, 55vw"
        className={`object-cover ${className}`}
      />

      {video && permitido && (
        <video
          ref={ref}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setTocando(true)}
          onError={() => setTocando(false)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
            tocando ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}
    </div>
  )
}
