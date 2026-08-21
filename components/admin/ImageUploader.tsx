"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { useSite } from "../SiteContext"
import { createClient } from "@/lib/supabase/client"
import { marcarDagua } from "@/lib/watermark"

const LIMITES = {
  image: { bytes: 10 * 1024 * 1024, accept: "image/jpeg,image/png,image/webp,image/avif", rotulo: "10 MB" },
  video: { bytes: 60 * 1024 * 1024, accept: "video/mp4,video/webm", rotulo: "60 MB" },
} as const

/**
 * Envia as fotos direto do navegador para o Storage do Supabase e devolve as
 * URLs públicas. Passar arquivo por server action obrigaria a trafegar o
 * binário pelo servidor do Next sem ganho nenhum.
 */
export function ImageUploader({
  label,
  hint,
  name,
  kind = "image",
  watermark = false,
  multiple = false,
  initial = [],
}: {
  label: string
  hint?: string
  name: string
  /** `video` troca os formatos aceitos, o limite de tamanho e a pré-visualização. */
  kind?: "image" | "video"
  /** Grava a marca d'água no arquivo antes de enviar. Só para foto de imóvel. */
  watermark?: boolean
  multiple?: boolean
  initial?: string[]
}) {
  const limite = LIMITES[kind]
  const site = useSite()
  const [urls, setUrls] = useState<string[]>(initial.filter(Boolean))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [naoReproduz, setNaoReproduz] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return

    setBusy(true)
    setError(null)
    setNaoReproduz(null)
    const supabase = createClient()
    const uploaded: string[] = []

    for (const file of Array.from(files)) {
      if (file.size > limite.bytes) {
        setError(`"${file.name}" passa de ${limite.rotulo}. Reduza o arquivo e tente de novo.`)
        continue
      }

      let paraEnviar = file
      if (watermark && kind === "image") {
        try {
          paraEnviar = await marcarDagua(file, site.name)
        } catch {
          // Falha ao marcar não pode impedir o cadastro; segue o arquivo original.
        }
      }

      // Nome único: manter o nome original causaria colisão entre imóveis.
      const extension = paraEnviar.name.split(".").pop()?.toLowerCase() || "jpg"
      const path = `${crypto.randomUUID()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from("imoveis")
        .upload(path, paraEnviar, { cacheControl: "31536000", upsert: false })

      if (uploadError) {
        setError(`Falha ao enviar "${file.name}": ${uploadError.message}`)
        continue
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("imoveis").getPublicUrl(path)
      uploaded.push(publicUrl)
    }

    setUrls((prev) => (multiple ? [...prev, ...uploaded] : uploaded.slice(-1)))
    setBusy(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  function remove(url: string) {
    setUrls((prev) => prev.filter((item) => item !== url))
  }

  return (
    <div>
      <span className="mb-3 block text-[9px] uppercase tracking-[0.22em] text-muted">{label}</span>
      {hint && <p className="mb-4 text-[11px] text-muted">{hint}</p>}

      {/*
        O valor que a server action lê. Para a galeria mandamos uma URL por
        linha, mesmo formato aceito no campo de texto.
      */}
      <input type="hidden" name={name} value={urls.join("\n")} />

      {urls.length > 0 && (
        <ul className="mb-5 flex flex-wrap gap-3">
          {urls.map((url) => (
            <li key={url} className="relative">
              <div className="relative size-24 overflow-hidden bg-cream-deep">
                {kind === "video" ? (
                  <video
                    src={url}
                    muted
                    loop
                    playsInline
                    autoPlay
                    // A pré-visualização é o teste: se este navegador não
                    // reproduz o arquivo, o site também não vai.
                    onCanPlay={() => setNaoReproduz(null)}
                    onError={() => setNaoReproduz(url)}
                    className="size-full object-cover"
                  />
                ) : (
                  <Image src={url} alt="" fill sizes="96px" className="object-cover" />
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(url)}
                aria-label={kind === "video" ? "Remover vídeo" : "Remover imagem"}
                className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-graphite text-xs text-cream transition-colors hover:bg-red-700"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={limite.accept}
        multiple={multiple}
        disabled={busy}
        onChange={(e) => handleFiles(e.target.files)}
        className="block w-full text-[12px] text-muted file:mr-4 file:border file:border-graphite/25 file:bg-transparent file:px-5 file:py-2.5 file:text-[10px] file:uppercase file:tracking-[0.18em] file:text-graphite hover:file:border-graphite"
      />

      {busy && <p className="mt-3 text-[11px] text-gold-deep">Enviando…</p>}

      {naoReproduz && (
        <p role="alert" className="mt-3 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-[12px] leading-relaxed text-red-800">
          Este navegador não conseguiu reproduzir o arquivo. O site vai se comportar do mesmo jeito para quem
          usa este navegador. A causa quase sempre é o codec: exporte o MP4 em <strong>H.264</strong>, que toca
          em tudo. H.265 (HEVC) funciona no iPhone e falha no Chrome e no Firefox do computador.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-[11px] text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
