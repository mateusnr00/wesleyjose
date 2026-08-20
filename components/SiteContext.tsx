"use client"

import { createContext, useContext } from "react"


export interface SiteData {
  name: string
  tagline: string
  founderName: string
  founderRole: string
  creci: string
  whatsapp: string
  whatsappDisplay: string
  email: string
  street: string
  district: string
  city: string
  state: string
  hours: string
  instagram: string
  instagramHandle: string
  nav: { label: string; href: string }[]
}

const SiteContext = createContext<SiteData | null>(null)

/**
 * Dados da marca vindos do painel.
 *
 * São lidos por praticamente todo componente de cliente (links de WhatsApp,
 * rodapé, menu). Passá-los por props exigiria encadear props em cada camada
 * só para chegar a uma folha.
 */
export function SiteProvider({ value, children }: { value: SiteData; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite(): SiteData {
  const value = useContext(SiteContext)
  if (!value) throw new Error("useSite precisa estar dentro de <SiteProvider>")
  return value
}

export { waLink } from "@/lib/whatsapp"
