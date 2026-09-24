/**
 * Lume — Configuração centralizada da loja (White-Label).
 *
 * PARA CONFIGURAR UMA NOVA LOJA CLIENTE:
 * 1. Altere o nome, WhatsApp, dados e as CORES (primaryColor, secondaryColor) abaixo.
 * 2. Substitua o logotipo em 'public/images/logo.png'.
 * E pronto! Toda a vitrine, rodapé, sacola, botões, SEO e links de WhatsApp serão atualizados.
 */

const STORE_NAME = 'Lume';

export const STORE_CONFIG = {
  /** Cor primária da marca: Verde Neon Lume (#0DF5A4) */
  primaryColor: '#0DF5A4',

  /** Cor secundária/auxiliar da marca: Branco Puro (#FFFFFF) */
  secondaryColor: '#FFFFFF',

  /** Fundo Cyber Black (#080809) */
  backgroundColor: '#080809',

  /** Fundo das Seções da Vitrine / Cards (#080809) */
  sectionBg: '#080809',

  /** Nome da loja exibido no site e no painel */
  name: STORE_NAME,

  /** Subtítulo / Tagline da marca no header */
  tagline: 'FUTUREWEAR & TECH APPAREL',

  /** Slogan / Descrição resumida da loja para SEO e rodapé */
  description: 'Peças desenvolvidas com design futurista, tecidos tecnológicos de alta respirabilidade e caimento impecável. A marca oficial que une tecnologia, alta conversão e moda.',

  /** Caminho do logotipo/monograma principal (fundo transparente) */
  logoUrl: '/images/lume-icon.png',

  /** Logotipo completo com tipografia e monograma (fundo transparente) */
  fullLogoUrl: '/images/lume-logo.png',

  /** Logotipo original */
  originalLogoUrl: '/images/lume-logo.jpg',

  /** Número do WhatsApp do vendedor (com código do país e DDD, sem + ou espaços) */
  whatsappNumber: '5511999998888',

  /** Número do WhatsApp formatado para exibição visual */
  whatsappFormatted: '+55 11 99999-8888',

  /** E-mail oficial de contato */
  email: 'contato@lume.com.br',

  /** Horário de atendimento exibido no rodapé */
  businessHours: 'Segunda a Sábado — 09:00 às 20:00',

  /** Título e texto do manifesto / conceito na Home */
  aboutEyebrow: 'LUME OFICIAL',
  aboutTitle: 'Tecnologia de ponta em cada costura.',
  aboutText: 'A Lume combina estética cyber-minimalista, tecidos tecnológicos respiráveis com proteção UV50+ e modelagens anatômicas contemporâneas. Estilo inteligente para quem dita o futuro.',

  /** Moeda utilizada */
  currency: 'BRL',

  /** Locale para formatação */
  locale: 'pt-BR',

  /** Mensagem de saudação padrão do WhatsApp */
  whatsappGreeting: `Olá! Gostaria de fazer um pedido na ${STORE_NAME}.`,

  /** Mensagem de encerramento do WhatsApp */
  whatsappClosing: 'Gostaria de finalizar meu pedido.',
} as const;
