import { parseDestaque } from "@/lib/content-schema"

/**
 * Renderiza o texto com *asteriscos* virando o itálico dourado.
 *
 * O texto vem do painel, então nada de dangerouslySetInnerHTML: quebramos em
 * pedaços e só o trecho marcado ganha <em>. Marcação inventada no campo sai
 * como texto puro.
 */
export function Destaque({ children }: { children: string }) {
  return (
    <>
      {parseDestaque(children).map((parte, i) =>
        parte.accent ? <em key={i}>{parte.text}</em> : <span key={i}>{parte.text}</span>,
      )}
    </>
  )
}
