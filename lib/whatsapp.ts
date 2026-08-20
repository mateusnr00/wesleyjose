/**
 * Monta um link de WhatsApp com mensagem pré-preenchida.
 *
 * Fica fora de components/SiteContext.tsx porque aquele módulo é "use client":
 * uma função exportada de lá não pode ser chamada por componente de servidor.
 */
export function waLink(whatsapp: string, message?: string): string {
  const base = `https://wa.me/${whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
