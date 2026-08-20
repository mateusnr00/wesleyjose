"use client"

import { ImageUploader } from "./ImageUploader"
import type { Field } from "@/lib/content-schema"

const input =
  "w-full border-0 border-b border-line bg-transparent pb-3 text-sm outline-none transition-colors focus:border-gold"

/**
 * Desenha os campos a partir do schema.
 *
 * Uma tela só serve para todos os blocos e listas: acrescentar um campo em
 * lib/content-schema.ts já o faz aparecer aqui, com rótulo e ajuda.
 */
export function ContentFields({
  fields,
  values,
}: {
  fields: readonly Field[]
  values: Record<string, string>
}) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {fields.map((field) => {
        const largo = field.type !== "text" && field.type !== "url"
        const valor = values[field.name] ?? field.default

        return (
          <div key={field.name} className={largo ? "sm:col-span-2" : ""}>
            {field.type === "image" ? (
              <ImageUploader
                label={field.label}
                hint={field.help}
                name={field.name}
                initial={valor ? [valor] : []}
              />
            ) : (
              <label className="block">
                <span className="mb-3 block text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
                  {field.label}
                </span>

                {field.type === "longtext" ? (
                  <textarea name={field.name} rows={5} defaultValue={valor} className={`${input} resize-y`} />
                ) : field.type === "textarea" ? (
                  <textarea name={field.name} rows={3} defaultValue={valor} className={`${input} resize-y`} />
                ) : (
                  <input
                    type={field.type === "url" ? "url" : "text"}
                    name={field.name}
                    defaultValue={valor}
                    className={input}
                  />
                )}

                {(field.help || field.destaque) && (
                  <span className="mt-2 block text-[11px] text-muted">
                    {field.help}
                    {field.destaque && (
                      <>
                        {field.help ? " " : ""}
                        Um trecho entre asteriscos vira o itálico dourado: <code>*próximo nível*</code>.
                      </>
                    )}
                  </span>
                )}
              </label>
            )}
          </div>
        )
      })}
    </div>
  )
}
