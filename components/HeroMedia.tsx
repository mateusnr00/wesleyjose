"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

/**
 * Foto do topo com vídeo opcional em laço por cima.
 *
 * A ordem importa para o desempenho: a imagem é renderizada sempre, com
 * `priority`, e continua sendo o elemento de LCP. O vídeo é uma camada
 * adicional que só aparece depois de `canplay`, então nunca atrasa a primeira
 * pintura, e se falhar, demorar ou o navegador recusar o autoplay, o que fica
 * na tela é a foto.
 *
 * Aceita duas versões do vídeo. Encher uma tela larga com material vertical, ou
 * uma tela em pé com material deitado, obriga a cortar muito das bordas; com as
 * duas, cada formato recebe o corte que foi pensado para ele.
 */
export function HeroMedia({
  image,
  video,
  videoVertical,
  alt,
  className = "",
  unoptimized = false,
}: {
  /** Sem foto, fica só o fundo sólido da seção até o vídeo entrar. */
  image?: string
  /** Versão 16:9. */
  video?: string
  /** Versão 9:16. */
  videoVertical?: string
  alt: string
  className?: string
  unoptimized?: boolean
}) {
  const [tocando, setTocando] = useState(false)
  const [permitido, setPermitido] = useState(false)
  const [telaLarga, setTelaLarga] = useState<boolean | null>(null)
  const ref = useRef<HTMLVideoElement>(null)
  const moldura = useRef<HTMLDivElement>(null)

  const temAlgumVideo = Boolean(video || videoVertical)

  useEffect(() => {
    if (!temAlgumVideo) return

    const conexao = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conexao?.saveData) return

    const larga = window.matchMedia("(min-width: 1024px)")
    const aplicar = () => setTelaLarga(larga.matches)
    aplicar()
    larga.addEventListener("change", aplicar)

    // Só começa a baixar depois que a página assentou, para o vídeo não
    // disputar banda com o que precisa aparecer primeiro.
    const id = window.setTimeout(() => setPermitido(true), 600)

    return () => {
      window.clearTimeout(id)
      larga.removeEventListener("change", aplicar)
    }
  }, [temAlgumVideo])

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

  // Cada formato tem a sua versão; faltando uma, a outra serve às duas telas.
  const escolhido = telaLarga === null ? undefined : telaLarga ? video || videoVertical : videoVertical || video

  return (
    <div ref={moldura} className="absolute inset-0">
      {image && (
        <Image
          src={image}
          alt={alt}
          fill
          priority
          unoptimized={unoptimized}
          sizes="100vw"
          className={`object-cover ${className}`}
        />
      )}

      {escolhido && permitido && (
        <video
          // Trocar de formato recria o elemento, senão o navegador manteria o
          // arquivo anterior em buffer.
          key={escolhido}
          ref={ref}
          src={escolhido}
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
