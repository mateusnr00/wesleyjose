/**
 * Estrutura editável do site.
 *
 * Este arquivo define QUAIS campos existem e qual é o texto padrão de cada um.
 * O banco guarda apenas o que foi alterado no painel, e a leitura mescla os
 * dois. Assim o site nunca fica sem texto: um campo que ninguém tocou continua
 * vindo daqui, e um deploy novo pode acrescentar campos sem migração de dados.
 *
 * Em campos marcados como `destaque`, um trecho entre asteriscos vira o
 * itálico dourado: "Imóveis que representam o seu *próximo nível*".
 */

export type FieldType = "text" | "textarea" | "longtext" | "url" | "image" | "video"

export interface Field {
  name: string
  label: string
  type: FieldType
  help?: string
  /** Aceita *asterisco* para o itálico dourado. */
  destaque?: boolean
  default: string
}

export interface BlockSchema {
  label: string
  group: string
  fields: Field[]
}

export interface CollectionSchema {
  label: string
  group: string
  help?: string
  /** Campo usado como título na listagem do painel. */
  titleField: string
  fields: Field[]
  defaults: Record<string, string>[]
}

/* ------------------------------------------------------------------ */
/* Blocos: um conjunto fixo de campos                                  */
/* ------------------------------------------------------------------ */

export const blocks = {
  marca: {
    label: "Marca",
    group: "Geral",
    fields: [
      { name: "name", label: "Nome", type: "text", default: "Premium Imóveis" },
      { name: "tagline", label: "Descrição curta", type: "text", default: "Curadoria de imóveis de alto padrão em Goiânia" },
      {
        name: "description",
        label: "Descrição para buscadores",
        type: "textarea",
        help: "Aparece no Google e ao compartilhar o link.",
        default:
          "Consultoria imobiliária de alto padrão em Goiânia. Curadoria de residências, coberturas, lançamentos e oportunidades off-market para quem compra com critério e vende com estratégia.",
      },
      { name: "founderName", label: "Nome do consultor", type: "text", default: "Wesley José" },
      { name: "founderRole", label: "Cargo", type: "text", default: "Fundador e consultor responsável" },
      { name: "creci", label: "CRECI", type: "text", default: "CRECI-GO 00000" },
    ],
  },

  contato: {
    label: "Contato",
    group: "Geral",
    fields: [
      {
        name: "whatsapp",
        label: "WhatsApp (só números, com país)",
        type: "text",
        help: "Formato 55 + DDD + número, sem espaços ou símbolos. Ex.: 5562999999999",
        default: "5562000000000",
      },
      { name: "whatsappDisplay", label: "Telefone exibido", type: "text", default: "(62) 0000-0000" },
      { name: "email", label: "E-mail", type: "text", default: "contato@premiumimoveis.com.br" },
      { name: "street", label: "Endereço", type: "text", default: "Av. Dep. Jamel Cecílio" },
      { name: "district", label: "Bairro", type: "text", default: "Jardim Goiás" },
      { name: "city", label: "Cidade", type: "text", default: "Goiânia" },
      { name: "state", label: "Estado", type: "text", default: "GO" },
      { name: "hours", label: "Horário de atendimento", type: "text", default: "Seg a sex, 9h às 19h" },
      { name: "ctaCorretor", label: "Botão do topo", type: "text", default: "Fale com um corretor" },
      { name: "instagram", label: "Link do Instagram", type: "url", default: "https://www.instagram.com/premiumimoveisgo/" },
      { name: "instagramHandle", label: "@ do Instagram", type: "text", default: "@premiumimoveisgo" },
    ],
  },

  home_hero: {
    label: "Topo",
    group: "Início",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Consultoria imobiliária de alto padrão" },
      {
        name: "title",
        label: "Título",
        type: "textarea",
        destaque: true,
        default: "O investimento que você *mora* dentro.",
      },
      {
        name: "text",
        label: "Parágrafo",
        type: "textarea",
        default:
          "Há 18 anos selecionando imóveis de alto padrão em Goiás, São Paulo e Santa Catarina. Cada indicação passa por análise de projeto, documentação e potencial de valorização antes de virar uma visita, porque patrimônio não se compra no impulso.",
      },
      { name: "ctaPrimary", label: "Botão principal", type: "text", default: "Ver imóveis" },
      { name: "ctaSecondary", label: "Botão secundário", type: "text", default: "Falar no WhatsApp" },
      { name: "spotlightLabel", label: "Etiqueta do imóvel em destaque", type: "text", default: "Em destaque" },
      {
        name: "image",
        label: "Foto de fundo",
        type: "image",
        help:
          "Deitada, 1920 × 1080 ou maior. É ela que aparece primeiro e fica no lugar do vídeo enquanto ele carrega. Vazio, o topo fica só com o fundo escuro da marca.",
        default: "",
      },
      {
        name: "video",
        label: "Vídeo horizontal 16:9 (computador)",
        type: "video",
        help:
          "MP4 sem som, 1920 × 1080, 8 a 15 s, até 60 MB. Usado em telas largas. Se o vertical estiver vazio, este também é usado no celular, e aí só a faixa central aparece.",
        default: "",
      },
      {
        name: "videoVertical",
        label: "Vídeo vertical 9:16 (celular)",
        type: "video",
        help:
          "MP4 sem som, 1080 × 1920, mesmas regras. Preencher os dois é o ideal: cada tela recebe o corte certo, sem perder as laterais. Vazio, o celular usa o horizontal.",
        default: "",
      },
    ],
  },

  home_caminhos: {
    label: "Comprar ou vender",
    group: "Início",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Por onde começar" },
      { name: "title", label: "Título", type: "textarea", destaque: true, default: "Dois caminhos, a *mesma* consultoria." },
    ],
  },

  home_sobre: {
    label: "Sobre",
    group: "Início",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "A Premium" },
      { name: "title", label: "Título", type: "textarea", destaque: true, default: "Patrimônio se *constrói* com escolhas raras." },
      {
        name: "text1",
        label: "Primeiro parágrafo",
        type: "longtext",
        default:
          "A Premium Imóveis nasceu de uma inconformidade simples: imóvel de alto padrão continua sendo vendido como commodity, empilhado em portal, com foto ruim e informação incompleta. Quem compra nessa faixa não precisa de mais opções, precisa das opções certas.",
      },
      {
        name: "text2",
        label: "Segundo parágrafo",
        type: "longtext",
        default:
          "Trabalhamos com um número deliberadamente pequeno de imóveis por vez. Isso permite conhecer cada um a fundo, conduzir a negociação com informação de verdade e proteger o tempo de quem está do outro lado da mesa.",
      },
      {
        name: "photo",
        label: "Foto do consultor",
        type: "image",
        help: "Retrato em pé, proporção 4:5 (ex.: 1200 × 1500). Foto deitada é cortada nas laterais.",
        default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },

  home_portfolio: {
    label: "Portfólio",
    group: "Início",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Portfólio atual" },
      { name: "title", label: "Título", type: "textarea", destaque: true, default: "Seleção de imóveis com *história* e proporção." },
      {
        name: "text",
        label: "Parágrafo",
        type: "textarea",
        default:
          "Cada imóvel abaixo passou por uma verificação de matrícula, projeto aprovado e histórico de valorização do endereço. O que não passa, não entra.",
      },
      {
        name: "footnote",
        label: "Observação no rodapé",
        type: "textarea",
        default: "Procura algo que não está listado? Boa parte do nosso estoque é off-market e não aparece aqui.",
      },
      { name: "linkLabel", label: "Link", type: "text", default: "Ver o catálogo completo" },
    ],
  },

  home_bairros: {
    label: "Bairros",
    group: "Início",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Por endereço" },
      { name: "title", label: "Título", type: "textarea", destaque: true, default: "Onde você quer *morar*?" },
      { name: "linkLabel", label: "Link", type: "text", default: "Ver todos os bairros" },
    ],
  },

  home_consultoria: {
    label: "Consultoria",
    group: "Início",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Consultoria" },
      { name: "title", label: "Título", type: "textarea", destaque: true, default: "Quatro frentes, *uma só* consultoria." },
    ],
  },

  home_vendedores: {
    label: "Faixa para proprietários",
    group: "Início",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Para proprietários" },
      {
        name: "title",
        label: "Título",
        type: "textarea",
        destaque: true,
        default: "Seu imóvel vale mais do que a *tabela do portal* sugere.",
      },
      {
        name: "text",
        label: "Parágrafo",
        type: "longtext",
        default:
          "Preparamos uma avaliação gratuita com base nas transações reais do seu bairro nos últimos 24 meses, não em anúncios. Você recebe a faixa de valor, o tempo médio de venda e a estratégia que recomendamos. Sem compromisso e sem placa na fachada.",
      },
      { name: "ctaPrimary", label: "Botão principal", type: "text", default: "Avaliar meu imóvel" },
      { name: "ctaSecondary", label: "Botão secundário", type: "text", default: "Como funciona" },
      {
        name: "image",
        label: "Foto de fundo",
        type: "image",
        help: "Deitada e larga, ao menos 2000 px. Fica sob um véu escuro com texto por cima, então evite fotos muito claras ou cheias de detalhe.",
        default: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80",
      },
    ],
  },

  home_depoimentos: {
    label: "Depoimentos",
    group: "Início",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Clientes" },
      { name: "title", label: "Título", type: "textarea", destaque: true, default: "Relações que *permanecem* depois das chaves." },
      {
        name: "text",
        label: "Parágrafo",
        type: "textarea",
        default:
          "A maior parte dos negócios da Premium Imóveis chega por indicação de quem já comprou ou vendeu com a gente. É o indicador que levamos mais a sério.",
      },
    ],
  },

  home_boletim: {
    label: "Boletim",
    group: "Início",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Boletim mensal" },
      { name: "title", label: "Título", type: "text", default: "Receba a curadoria do mês." },
      {
        name: "text",
        label: "Parágrafo",
        type: "textarea",
        default:
          "Uma vez por mês, os imóveis que entraram no portfólio da Premium Imóveis e uma leitura curta do mercado de alto padrão em Goiânia. Sem spam, cancelamento em um clique.",
      },
      { name: "button", label: "Botão", type: "text", default: "Cadastrar" },
    ],
  },

  home_contato: {
    label: "Contato",
    group: "Início",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Contato direto" },
      { name: "title", label: "Título", type: "textarea", destaque: true, default: "Vamos conversar sobre o que você *procura*." },
      {
        name: "text",
        label: "Parágrafo",
        type: "longtext",
        default:
          "Responder uma mensagem leva menos tempo do que percorrer trinta anúncios. Conte o que você precisa e a gente volta com uma lista curta, ou com a informação de que ainda não é hora de comprar.",
      },
      { name: "button", label: "Botão do formulário", type: "text", default: "Enviar pelo WhatsApp" },
    ],
  },

  imoveis_topo: {
    label: "Topo do catálogo",
    group: "Imóveis",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Portfólio" },
      { name: "title", label: "Título", type: "textarea", destaque: true, default: "Imóveis de alto padrão em *Goiânia*." },
      {
        name: "text",
        label: "Parágrafo",
        type: "textarea",
        default:
          "O que está aqui já passou pela nossa verificação. O que não está (e é boa parte) está em negociação reservada: fale com a Premium Imóveis para saber.",
      },
    ],
  },

  vender_topo: {
    label: "Topo",
    group: "Vender",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Para proprietários" },
      { name: "title", label: "Título", type: "textarea", destaque: true, default: "Quanto vale, de *verdade*, o seu imóvel?" },
      {
        name: "text",
        label: "Parágrafo",
        type: "longtext",
        default:
          "Anúncio não é valor de mercado. Preencha os dados ao lado e receba em até 48 horas um estudo com a faixa real do seu bairro, o tempo médio de venda e a estratégia que recomendamos para o seu caso.",
      },
    ],
  },

  vender_porque: {
    label: "Por que conosco",
    group: "Vender",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Por que conosco" },
      {
        name: "title",
        label: "Título",
        type: "textarea",
        destaque: true,
        default: "Vender bem é uma questão de *informação*, não de sorte.",
      },
    ],
  },

  vender_processo: {
    label: "Processo",
    group: "Vender",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "O processo" },
      { name: "title", label: "Título", type: "textarea", destaque: true, default: "Quatro etapas, *zero* improviso." },
      {
        name: "text",
        label: "Parágrafo",
        type: "textarea",
        default: "Da primeira conversa à escritura, você sabe exatamente em que ponto está e o que acontece depois.",
      },
    ],
  },

  vender_depoimento: {
    label: "Depoimento em destaque",
    group: "Vender",
    fields: [
      {
        name: "quote",
        label: "Depoimento",
        type: "longtext",
        default:
          "Vendi pelo valor pretendido em menos de 60 dias. Discrição absoluta, comunicação impecável e uma rede de compradores realmente qualificados.",
      },
      { name: "author", label: "Autor", type: "text", default: "Larissa Sousa · Vendedora, Alphaville Flamboyant" },
      {
        name: "image",
        label: "Foto de fundo",
        type: "image",
        help: "Deitada e larga, ao menos 2000 px. O texto do depoimento fica centralizado por cima.",
        default: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
      },
    ],
  },

  vender_duvidas: {
    label: "Dúvidas",
    group: "Vender",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Dúvidas" },
      { name: "title", label: "Título", type: "textarea", destaque: true, default: "Antes de *decidir*." },
    ],
  },

  home_clientes: {
    label: "Clientes atendidos",
    group: "Início",
    fields: [
      { name: "eyebrow", label: "Rótulo", type: "text", default: "Quem já confiou" },
      {
        name: "title",
        label: "Título",
        type: "textarea",
        destaque: true,
        default: "Nomes que não escolhem *por acaso*.",
      },
      {
        name: "text",
        label: "Parágrafo",
        type: "textarea",
        default:
          "Quem tem muito a perder em uma negociação mal conduzida costuma ser o cliente mais exigente. É com esse tipo de exigência que a gente trabalha há 18 anos.",
      },
    ],
  },

  rodape: {
    label: "Rodapé",
    group: "Geral",
    fields: [
      {
        name: "text",
        label: "Texto",
        type: "textarea",
        default: "Consultoria imobiliária de alto padrão em Goiânia. Curadoria, discrição e estratégia em cada negociação.",
      },
      {
        name: "legal",
        label: "Aviso legal",
        type: "text",
        default: "As imagens e valores exibidos podem sofrer alteração sem aviso prévio.",
      },
    ],
  },
} satisfies Record<string, BlockSchema>

export type BlockKey = keyof typeof blocks

/* ------------------------------------------------------------------ */
/* Coleções: listas onde se acrescenta, remove e reordena itens        */
/* ------------------------------------------------------------------ */

export const collections = {
  navegacao: {
    label: "Menu de navegação",
    group: "Geral",
    help: "A ordem aqui é a ordem do menu, no topo e no rodapé.",
    titleField: "label",
    fields: [
      { name: "label", label: "Texto", type: "text", default: "" },
      { name: "href", label: "Endereço", type: "text", help: "Ex.: /imoveis ou /#contato", default: "" },
    ],
    defaults: [
      { label: "Revenda", href: "/imoveis?segmento=revenda" },
      { label: "Lançamentos", href: "/imoveis?segmento=lancamento" },
      { label: "Aluguel", href: "/imoveis?segmento=aluguel" },
      { label: "Quem somos", href: "/#sobre" },
      { label: "Avaliações", href: "/vender" },
    ],
  },

  estatisticas: {
    label: "Números do topo",
    group: "Início",
    help: "Aparecem sob o título da página inicial. O número anima ao entrar na tela.",
    titleField: "value",
    fields: [
      { name: "value", label: "Número", type: "text", help: 'Ex.: "R$ 380M", "12 anos", "240+"', default: "" },
      { name: "label", label: "Legenda", type: "text", default: "" },
    ],
    defaults: [
      { value: "18 anos", label: "de mercado" },
      { value: "R$ 380M", label: "em imóveis negociados" },
      { value: "3 estados", label: "de atuação" },
    ],
  },

  caminhos: {
    label: "Cartões comprar / vender",
    group: "Início",
    titleField: "title",
    fields: [
      { name: "label", label: "Rótulo", type: "text", default: "" },
      { name: "title", label: "Título", type: "text", default: "" },
      { name: "text", label: "Texto", type: "textarea", default: "" },
      { name: "href", label: "Endereço do link", type: "text", default: "" },
      { name: "cta", label: "Chamada do link", type: "text", default: "" },
      {
        name: "image",
        label: "Foto",
        type: "image",
        help: "Em pé, proporção próxima de 3:4. O texto fica no rodapé do cartão, sobre um degradê escuro.",
        default: "",
      },
    ],
    defaults: [
      {
        label: "Quero comprar",
        title: "Encontrar o imóvel certo",
        text: "Portfólio verificado, mais o estoque off-market que não vai a portal nenhum.",
        href: "/imoveis",
        cta: "Ver imóveis",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      },
      {
        label: "Quero vender",
        title: "Saber quanto vale o meu",
        text: "Avaliação gratuita em 48h, com base em transações fechadas do seu bairro.",
        href: "/vender",
        cta: "Avaliar meu imóvel",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },

  pilares: {
    label: "Pilares",
    group: "Início",
    help: "As três colunas abaixo do texto sobre a Premium.",
    titleField: "title",
    fields: [
      { name: "title", label: "Título", type: "text", default: "" },
      { name: "text", label: "Texto", type: "textarea", default: "" },
    ],
    defaults: [
      { title: "Curadoria", text: "Antes de apresentar, visitamos. Projeto, implantação, vizinhança e documentação são checados na origem." },
      { title: "Discrição", text: "Boa parte do que negociamos nunca vira anúncio. Proprietário e comprador só se encontram quando faz sentido." },
      { title: "Estratégia", text: "Precificação com base em transações reais do bairro, não em tabela de portal. Negociação conduzida por quem conhece o comprador." },
    ],
  },

  consultoria: {
    label: "Frentes de consultoria",
    group: "Início",
    help: "A lista que abre e fecha na página inicial.",
    titleField: "title",
    fields: [
      { name: "title", label: "Título", type: "text", default: "" },
      { name: "summary", label: "Resumo", type: "textarea", help: "Aparece na linha fechada, ao lado do título.", default: "" },
      { name: "detail", label: "Texto ao abrir", type: "longtext", default: "" },
      {
        name: "image",
        label: "Foto",
        type: "image",
        help: "Deitada, proporção 3:2 (ex.: 900 × 600). Aparece ao abrir a frente na lista.",
        default: "",
      },
    ],
    defaults: [
      {
        title: "Residências",
        summary: "Casas de alto padrão em condomínio fechado e em bairros consolidados de Goiânia.",
        detail: "Avaliamos implantação no lote, orientação solar, qualidade construtiva e o histórico de valorização do endereço. Você recebe um comparativo com as transações reais dos últimos 24 meses no mesmo raio.",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Coberturas",
        summary: "Unidades de topo com vista permanente, terraço privativo e planta diferenciada.",
        detail: "Cobertura boa é escassa e some rápido. Mantemos relação direta com síndicos e proprietários das torres mais procuradas para saber da unidade antes de ela virar anúncio.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Lançamentos",
        summary: "Acesso a tabelas de pré-lançamento e às melhores posições de cada torre.",
        detail: "Negociamos direto com o incorporador, o que costuma significar condição de pagamento mais longa e escolha de unidade antes da abertura pública de vendas. Sem custo adicional para o comprador.",
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Off-market",
        summary: "Imóveis em negociação reservada, sem anúncio e sem exposição do proprietário.",
        detail: "Para quem vende, é discrição total: nenhuma placa, nenhum portal, nenhuma visita sem qualificação prévia. Para quem compra, é acesso a um estoque que simplesmente não existe publicamente.",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  depoimentos: {
    label: "Depoimentos",
    group: "Início",
    titleField: "author",
    fields: [
      { name: "quote", label: "Depoimento", type: "longtext", default: "" },
      { name: "author", label: "Nome", type: "text", default: "" },
      { name: "role", label: "Descrição", type: "text", help: "Ex.: Compradora · Setor Marista", default: "" },
    ],
    defaults: [
      { quote: "A Premium conduziu cada etapa com a paciência e o cuidado que eu esperava. Encontramos a casa certa e chegamos ao fim sem desgaste nenhum.", author: "Mariana Felippe Ribeiro", role: "Compradora · Setor Marista" },
      { quote: "É raro encontrar corretor que entenda patrimônio. Aqui pensam como sócio do cliente, inclusive quando a recomendação é não comprar.", author: "Amauri Antunes", role: "Investidor · Jardim Goiás" },
      { quote: "Vendi pelo valor pretendido em menos de 60 dias. Discrição absoluta, comunicação impecável e uma rede de compradores realmente qualificados.", author: "Larissa Sousa", role: "Vendedora · Alphaville Flamboyant" },
    ],
  },

  contato_interesses: {
    label: "Opções de interesse",
    group: "Início",
    help: "O que aparece na lista suspensa do formulário de contato.",
    titleField: "label",
    fields: [{ name: "label", label: "Opção", type: "text", default: "" }],
    defaults: [
      { label: "Comprar um imóvel" },
      { label: "Vender meu imóvel" },
      { label: "Avaliar meu imóvel" },
      { label: "Investimento / lançamento" },
      { label: "Outro assunto" },
    ],
  },

  vender_beneficios: {
    label: "Benefícios do topo",
    group: "Vender",
    help: "A lista com marcadores dourados ao lado do formulário.",
    titleField: "text",
    fields: [{ name: "text", label: "Texto", type: "text", default: "" }],
    defaults: [
      { text: "Gratuito e sem compromisso" },
      { text: "Baseado em transações fechadas, não em anúncios" },
      { text: "Resposta de um consultor, não de um robô" },
    ],
  },

  vender_motivos: {
    label: "Argumentos com número",
    group: "Vender",
    titleField: "value",
    fields: [
      { name: "value", label: "Número", type: "text", default: "" },
      { name: "label", label: "Legenda", type: "text", default: "" },
      { name: "text", label: "Texto", type: "textarea", default: "" },
    ],
    defaults: [
      { value: "24 meses", label: "de transações reais analisadas", text: "A faixa de valor vem do que de fato foi negociado no seu bairro, não do preço pedido em anúncio, que costuma estar 15% acima do fechamento." },
      { value: "68 dias", label: "de prazo médio de venda", text: "Precificação correta na largada é o que separa uma venda de 60 dias de um imóvel encalhado há dois anos com desconto sucessivo." },
      { value: "0 placas", label: "na fachada, se você preferir", text: "Vendemos off-market quando faz sentido: sem anúncio público, sem visita de curioso e sem seus vizinhos sabendo da negociação." },
    ],
  },

  vender_etapas: {
    label: "Etapas do processo",
    group: "Vender",
    titleField: "title",
    fields: [
      { name: "title", label: "Título", type: "text", default: "" },
      { name: "text", label: "Texto", type: "textarea", default: "" },
    ],
    defaults: [
      { title: "Avaliação", text: "Você preenche o formulário e recebe, em até 48h, um estudo com faixa de valor, comparáveis do bairro e tempo estimado de venda." },
      { title: "Visita técnica", text: "Um consultor visita o imóvel para conferir estado de conservação, diferenciais que a planta não mostra e o que vale ajustar antes de fotografar." },
      { title: "Preparação", text: "Fotografia profissional, planta humanizada e um dossiê com documentação pré-auditada. Comprador de alto padrão desiste na primeira dúvida jurídica." },
      { title: "Negociação", text: "Apresentamos primeiro à nossa carteira. Se abrir ao mercado, você aprova cada canal. Conduzimos proposta, contraproposta e escritura até a chave trocar de mão." },
    ],
  },

  vender_prazos: {
    label: "Prazos do formulário",
    group: "Vender",
    help: 'Opções da pergunta "Quando pretende vender?".',
    titleField: "label",
    fields: [{ name: "label", label: "Opção", type: "text", default: "" }],
    defaults: [
      { label: "O quanto antes" },
      { label: "Nos próximos 3 meses" },
      { label: "Ainda este ano" },
      { label: "Só quero saber o valor" },
    ],
  },

  duvidas: {
    label: "Perguntas frequentes",
    group: "Vender",
    titleField: "question",
    fields: [
      { name: "question", label: "Pergunta", type: "text", default: "" },
      { name: "answer", label: "Resposta", type: "longtext", default: "" },
    ],
    defaults: [
      { question: "A avaliação tem algum custo?", answer: "Não. O estudo é gratuito e não gera obrigação de vender conosco. Muitos proprietários pedem a avaliação apenas para entender o próprio patrimônio, e isso é legítimo." },
      { question: "Preciso assinar exclusividade?", answer: "Trabalhamos com contrato de exclusividade porque ele é o que viabiliza o investimento em fotografia, dossiê e curadoria de compradores. Mas o prazo é discutido caso a caso e sempre com cláusula de saída." },
      { question: "Qual é a comissão?", answer: "Seguimos a tabela do CRECI-GO para imóveis urbanos. O percentual exato é definido no contrato, junto com o que está incluso, e nada é cobrado antes do fechamento." },
      { question: "Meu imóvel vai aparecer em portal?", answer: "Só se você autorizar. Uma parte relevante do que vendemos nunca é anunciada: apresentamos direto à carteira de compradores qualificados, o que preserva sua privacidade e evita desgastar o imóvel no mercado." },
      { question: "Vocês atendem fora de Goiânia?", answer: "A Premium Imóveis atua em Goiânia e região metropolitana, incluindo Aparecida de Goiânia e Senador Canedo. Para imóveis fora dessa área, avaliamos caso a caso." },
    ],
  },

  estados: {
    label: "Estados de atuação",
    group: "Geral",
    help: "Aparecem no topo da home e no rodapé.",
    titleField: "nome",
    fields: [
      { name: "nome", label: "Estado", type: "text", default: "" },
      { name: "sigla", label: "Sigla", type: "text", help: "Duas letras, ex.: GO", default: "" },
    ],
    defaults: [
      { nome: "Goiás", sigla: "GO" },
      { nome: "São Paulo", sigla: "SP" },
      { nome: "Santa Catarina", sigla: "SC" },
    ],
  },

  clientes: {
    label: "Clientes atendidos",
    group: "Início",
    help:
      "Prova social por nome. Só inclua quem autorizou o uso do nome por escrito, e guarde o aceite: se alguém pedir remoção, basta excluir o item aqui.",
    titleField: "nome",
    fields: [
      { name: "nome", label: "Nome", type: "text", default: "" },
      { name: "descricao", label: "Descrição", type: "text", help: "Ex.: Emissora de TV, Artista", default: "" },
      {
        name: "logo",
        label: "Logo (opcional)",
        type: "image",
        help:
          "PNG com fundo transparente, deitado, altura de 200 px ou mais. Sem logo, o nome é composto na tipografia do site. Logo com fundo branco vira um retângulo branco sobre o fundo claro.",
        default: "",
      },
    ],
    defaults: [
      { nome: "Igreja Universal do Reino de Deus", descricao: "Instituição religiosa" },
      { nome: "Rede Record Goiás", descricao: "Emissora de TV" },
      { nome: "Silvia Abravanel", descricao: "Apresentadora" },
      { nome: "Balada Music", descricao: "Casa de shows" },
      { nome: "Junin Auto Som", descricao: "Rede de acessórios automotivos" },
    ],
  },
} satisfies Record<string, CollectionSchema>

export type CollectionKey = keyof typeof collections

/**
 * Acessores com o tipo largo.
 *
 * `satisfies` valida os literais mas preserva o tipo estreito de cada entrada,
 * então campos opcionais como `help` somem no acesso por chave dinâmica.
 */
export function blockSchema(key: BlockKey): BlockSchema {
  return blocks[key] as BlockSchema
}

export function collectionSchema(key: CollectionKey): CollectionSchema {
  return collections[key] as CollectionSchema
}

/** Valores padrão de um bloco, na forma que a leitura usa. */
export function blockDefaults(key: BlockKey): Record<string, string> {
  return Object.fromEntries(blocks[key].fields.map((f) => [f.name, f.default]))
}

/**
 * Converte *trecho* em itálico dourado.
 *
 * Devolve pedaços em vez de HTML: injetar markup vindo do banco abriria espaço
 * para script no site inteiro, e aqui só existe uma marcação para suportar.
 */
export function parseDestaque(value: string): { text: string; accent: boolean }[] {
  return value
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((parte) =>
      parte.startsWith("*") && parte.endsWith("*") && parte.length > 2
        ? { text: parte.slice(1, -1), accent: true }
        : { text: parte, accent: false },
    )
}
