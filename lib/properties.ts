export type Purpose = "venda" | "locacao"
export type PropertyKind = "residencia" | "cobertura" | "apartamento" | "lancamento" | "off-market"
export type PropertyStatus = "disponivel" | "exclusivo" | "vendido" | "lancamento"

export interface Property {
  slug: string
  name: string
  district: string
  city: string
  purpose: Purpose
  kind: PropertyKind
  status: PropertyStatus
  /** Preço em reais. `null` para imóveis sob consulta (off-market). */
  price: number | null
  area: number
  bedrooms: number
  suites: number
  parking: number
  headline: string
  description: string
  features: string[]
  image: string
  gallery: string[]
  featured: boolean
}

/**
 * TODO(cliente): substituir por imóveis e fotos reais.
 * As imagens abaixo são de banco público e servem apenas como marcação de layout.
 */
export const properties: Property[] = [
  {
    slug: "residencia-marista",
    name: "Residência Marista",
    district: "Setor Marista",
    city: "Goiânia",
    purpose: "venda",
    kind: "residencia",
    status: "exclusivo",
    price: 4850000,
    area: 620,
    bedrooms: 4,
    suites: 4,
    parking: 4,
    headline: "Arquitetura horizontal em terreno de esquina, com pé-direito duplo no estar.",
    description:
      "Projeto assinado com implantação que privilegia a orientação solar da tarde. Estrutura em concreto aparente, marcenaria sob medida em freijó e caixilhos de piso a teto integrando o living ao jardim interno. Área íntima isolada da social por circulação independente.",
    features: [
      "Pé-direito duplo no living",
      "Jardim interno com espelho d'água",
      "Adega climatizada para 400 garrafas",
      "Automação Control4",
      "Gerador de energia",
    ],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80",
    ],
    featured: true,
  },
  {
    slug: "cobertura-jardim-goias",
    name: "Cobertura Jardim Goiás",
    district: "Jardim Goiás",
    city: "Goiânia",
    purpose: "venda",
    kind: "cobertura",
    status: "disponivel",
    price: 6200000,
    area: 480,
    bedrooms: 4,
    suites: 4,
    parking: 5,
    headline: "Duplex no último pavimento com vista aberta para o Parque Flamboyant.",
    description:
      "Cobertura duplex com terraço privativo de 140 m², piscina com borda infinita e churrasqueira integrada. Living em três ambientes voltado para a face norte, com vista permanente do parque. Elevador privativo com hall exclusivo.",
    features: [
      "Terraço privativo de 140 m²",
      "Piscina com borda infinita",
      "Elevador privativo",
      "Vista permanente do Parque Flamboyant",
      "Cinco vagas cobertas",
    ],
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    ],
    featured: true,
  },
  {
    slug: "casa-alphaville",
    name: "Casa Alphaville",
    district: "Alphaville Flamboyant",
    city: "Goiânia",
    purpose: "venda",
    kind: "residencia",
    status: "disponivel",
    price: 5400000,
    area: 710,
    bedrooms: 5,
    suites: 5,
    parking: 6,
    headline: "Terreno de 1.200 m² em condomínio fechado, com lazer completo voltado ao fundo.",
    description:
      "Casa de dois pavimentos com suítes na ala oeste e área de lazer implantada no fundo do lote, garantindo privacidade total. Piscina aquecida, quadra de beach tennis e pomar formado. Segurança 24h com controle de acesso biométrico.",
    features: [
      "Terreno de 1.200 m²",
      "Piscina aquecida",
      "Quadra de beach tennis",
      "Condomínio com segurança 24h",
      "Pomar formado",
    ],
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
    ],
    featured: true,
  },
  {
    slug: "apartamento-bueno",
    name: "Apartamento Bueno",
    district: "Setor Bueno",
    city: "Goiânia",
    purpose: "venda",
    kind: "apartamento",
    status: "disponivel",
    price: 2950000,
    area: 260,
    bedrooms: 3,
    suites: 3,
    parking: 3,
    headline: "Planta reformada por escritório de interiores, pronta para morar.",
    description:
      "Apartamento de andar alto com reforma completa entregue em 2024. Living ampliado com integração da varanda, cozinha em ilha e lavabo com revestimento em pedra natural. Prédio com apenas dois apartamentos por andar.",
    features: [
      "Reforma completa entregue em 2024",
      "Cozinha em ilha",
      "Dois apartamentos por andar",
      "Andar alto com vista livre",
      "Mobiliário sob medida incluso",
    ],
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    ],
    featured: true,
  },
  {
    slug: "penthouse-park-lozandes",
    name: "Penthouse Park Lozandes",
    district: "Park Lozandes",
    city: "Goiânia",
    purpose: "venda",
    kind: "lancamento",
    status: "lancamento",
    price: 7800000,
    area: 540,
    bedrooms: 4,
    suites: 4,
    parking: 6,
    headline: "Última unidade do lançamento, com personalização de acabamentos ainda em aberto.",
    description:
      "Penthouse em torre única com entrega prevista para 2027. A unidade permite personalização de planta e acabamentos junto ao escritório do incorporador. Lazer do edifício com spa, coworking e adega compartilhada.",
    features: [
      "Entrega prevista para 2027",
      "Personalização de planta",
      "Torre única com 24 unidades",
      "Spa e coworking no edifício",
      "Tabela direta com o incorporador",
    ],
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80",
    ],
    featured: true,
  },
  {
    slug: "casa-serra-marista",
    name: "Casa Serra Marista",
    district: "Setor Marista",
    city: "Goiânia",
    purpose: "venda",
    kind: "off-market",
    status: "exclusivo",
    price: null,
    area: 840,
    bedrooms: 5,
    suites: 5,
    parking: 8,
    headline: "Negociação reservada, sem anúncio público e com visita mediante qualificação.",
    description:
      "Imóvel em negociação reservada a pedido do proprietário. Informações completas, plantas e valor são compartilhados apenas após alinhamento e qualificação do interessado. Visitas agendadas fora do horário comercial.",
    features: [
      "Negociação reservada",
      "Sem anúncio em portais",
      "Documentação pré-auditada",
      "Visita mediante qualificação",
    ],
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    ],
    featured: true,
  },
]

export const kindLabels: Record<PropertyKind, string> = {
  residencia: "Residência",
  cobertura: "Cobertura",
  apartamento: "Apartamento",
  lancamento: "Lançamento",
  "off-market": "Off-market",
}

export const statusLabels: Record<PropertyStatus, string> = {
  disponivel: "Disponível",
  exclusivo: "Exclusivo",
  vendido: "Vendido",
  lancamento: "Lançamento",
}

/** Formata valores em reais; imóveis sem preço aparecem como "Sob consulta". */
export function formatPrice(price: number | null): string {
  if (price === null) return "Sob consulta"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price)
}

/** Bairros presentes no catálogo, em ordem alfabética, para alimentar o filtro. */
export function districts(): string[] {
  return [...new Set(properties.map((p) => p.district))].sort((a, b) => a.localeCompare(b, "pt-BR"))
}

export function getProperty(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug)
}
