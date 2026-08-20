/**
 * Fonte única de verdade da marca.
 * Trocar um valor aqui reflete no site inteiro (header, footer, metadata, formulários).
 *
 * TODO(cliente): confirmar telefone, e-mail, CRECI e endereço reais antes de publicar.
 */
export const site = {
  name: "Premium Imóveis",
  shortName: "Premium",
  tagline: "Curadoria de imóveis de alto padrão em Goiânia",
  description:
    "Consultoria imobiliária de alto padrão em Goiânia. Curadoria de residências, coberturas, lançamentos e oportunidades off-market para quem compra com critério e vende com estratégia.",
  url: "https://premiumimoveis.com.br",
  locale: "pt-BR",

  // Sobre o profissional à frente da operação.
  founder: {
    name: "Wesley José",
    role: "Fundador e consultor responsável",
    creci: "CRECI-GO 00000", // TODO(cliente): número real
  },

  contact: {
    // Formato E.164, sem máscara, usado nos links de WhatsApp e tel:
    whatsapp: "5562000000000", // TODO(cliente): número real
    whatsappDisplay: "(62) 0000-0000",
    email: "contato@premiumimoveis.com.br",
    address: {
      street: "Av. Dep. Jamel Cecílio",
      district: "Jardim Goiás",
      city: "Goiânia",
      state: "GO",
    },
    hours: "Seg a sex, 9h às 19h",
  },

  social: {
    instagram: "https://www.instagram.com/premiumimoveisgo/",
    instagramHandle: "@premiumimoveisgo",
    linkedin: "",
  },

  /** Números de prova social exibidos no hero. */
  stats: [
    { value: "R$ 380M", label: "em imóveis negociados" },
    { value: "12 anos", label: "de mercado em Goiânia" },
    { value: "240+", label: "famílias atendidas" },
  ],
} as const

/** Monta um link de WhatsApp com mensagem pré-preenchida. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.contact.whatsapp}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export const nav = [
  { label: "Imóveis", href: "/imoveis" },
  { label: "Vender", href: "/vender" },
  { label: "Consultoria", href: "/#consultoria" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Contato", href: "/#contato" },
] as const
