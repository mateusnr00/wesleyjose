"use client"

/**
 * Exclusão é irreversível, então pedimos confirmação no cliente antes de
 * deixar o form chegar na server action.
 */
export function DeleteButton({ name }: { name: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) {
          event.preventDefault()
        }
      }}
      className="text-[10px] uppercase tracking-[0.18em] text-red-700 transition-colors hover:text-red-900"
    >
      Excluir
    </button>
  )
}
