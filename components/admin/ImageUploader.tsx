"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const MAX_BYTES = 10 * 1024 * 1024

/**
 * Envia as fotos direto do navegador para o Storage do Supabase e devolve as
 * URLs públicas. Passar arquivo por server action obrigaria a trafegar o
 * binário pelo servidor do Next sem ganho nenhum.
 */
export function ImageUploader({
  label,
  hint,
  name,
  multiple = false,
  initial = [],
}: {
  label: string
  hint?: string
  name: string
  multiple?: boolean
  initial?: string[]
}) {
  const [urls, setUrls] = useState<string[]>(initial.filter(Boolean))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return

    setBusy(true)
    setError(null)
    const supabase = createClient()
    const uploaded: string[] = []

    for (const file of Array.from(files)) {
      if (file.size > MAX_BYTES) {
        setError(`"${file.name}" passa de 10 MB. Reduza a imagem e tente de novo.`)
        continue
      }

      // Nome único: manter o nome original causaria colisão entre imóveis.
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const path = `${crypto.randomUUID()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from("imoveis")
        .upload(path, file, { cacheControl: "31536000", upsert: false })

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
                <Image src={url} alt="" fill sizes="96px" className="object-cover" />
              </div>
              <button
                type="button"
                onClick={() => remove(url)}
                aria-label="Remover imagem"
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
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={multiple}
        disabled={busy}
        onChange={(e) => handleFiles(e.target.files)}
        className="block w-full text-[12px] text-muted file:mr-4 file:border file:border-graphite/25 file:bg-transparent file:px-5 file:py-2.5 file:text-[10px] file:uppercase file:tracking-[0.18em] file:text-graphite hover:file:border-graphite"
      />

      {busy && <p className="mt-3 text-[11px] text-gold-deep">Enviando…</p>}
      {error && (
        <p role="alert" className="mt-3 text-[11px] text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
