import { Category, Product } from '../models/store.models';

export interface DemoThemeConfig {
  id: string;
  name: string;
  segment: string;
  badge: string;
  tagline: string;
  description: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  heroImage: string;
  logoUrl: string;
  fullLogoUrl: string;
  whatsappNumber: string;
  whatsappFormatted: string;
  email: string;
  businessHours: string;
  primaryColor: string;
  primaryContrast: string;
  secondaryColor: string;
  backgroundColor: string;
  sectionBg?: string;
  headerBg: string;
  headerBorder: string;
  perks: { title: string; desc: string }[];
  categories: Category[];
  products: Product[];
}

export const DEMO_THEMES: Record<string, DemoThemeConfig> = {
  lume: {
    id: 'lume',
    name: 'Lume',
    segment: 'Futurewear & Tech Apparel',
    badge: 'MARCA OFICIAL // WHITE-LABEL',
    tagline: 'FUTUREWEAR & TECH APPAREL',
    description: 'Peças desenvolvidas com design futurista, tecidos tecnológicos de alta respirabilidade e caimento impecável. A marca oficial que une tecnologia, alta conversão e moda.',
    aboutEyebrow: 'LUME OFICIAL',
    aboutTitle: 'Tecnologia de ponta em cada costura.',
    aboutText: 'A Lume combina estética cyber-minimalista, tecidos tecnológicos respiráveis com proteção UV50+ e modelagens anatômicas contemporâneas. Estilo inteligente para quem dita o futuro.',
    heroImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=85',
    logoUrl: '/images/lume-icon.png',
    fullLogoUrl: '/images/lume-logo.png',
    whatsappNumber: '5511999998888',
    whatsappFormatted: '+55 11 99999-8888',
    email: 'contato@lume.com.br',
    businessHours: 'Segunda a Sábado — 09:00 às 20:00',
    primaryColor: '#0DF5A4',
    primaryContrast: '#000000',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#080809',
    sectionBg: '#080809',
    headerBg: 'rgba(8, 8, 9, 0.95)',
    headerBorder: 'rgba(13, 245, 164, 0.25)',
    perks: [
      { title: 'TECNOLOGIA CYBER DRY & REFLECT', desc: 'Fibras inteligentes respiráveis com detalhes refletivos e proteção UV50+' },
      { title: 'MODELAGENS ANATÔMICAS TECH', desc: 'Caimento ergonômico projetado para mobilidade e presença visual marcante' }
    ],
    categories: [
      {
        id: 'cat-lum-1',
        name: 'Camisetas Tech & Cyber',
        slug: 'camisetas-tech',
        description: 'Camisetas em malha tecnológica de alta gramatura com toque sedoso e detalhes neon.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80'
      },
      {
        id: 'cat-lum-2',
        name: 'Hoodies & Agasalhos',
        slug: 'hoodies-agasalhos',
        description: 'Moletons tecnológicos estruturados e agasalhos com acabamento futurista.',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80'
      },
      {
        id: 'cat-lum-3',
        name: 'Calças Táticas & Joggers',
        slug: 'calcas-joggers',
        description: 'Calças utilitárias com múltiplos bolsos e ajuste ergonômico nos tornozelos.',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'
      },
      {
        id: 'cat-lum-4',
        name: 'Casacos & Corta-Ventos',
        slug: 'casacos-corta-ventos',
        description: 'Corta-ventos repelentes à água e casacos térmicos de alta performance.',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'
      }
    ],
    products: [
      {
        id: 'lum-1',
        sku: 'LUM-CAM-001',
        name: 'Camiseta Cyber Tech Neon Glow',
        slug: 'camiseta-cyber-tech-neon-glow',
        description: 'Camiseta masculina e unissex confeccionada em malha tecnológica dry-cotton com acabamento sedoso e detalhe minimalista glow neon. Máxima respirabilidade e estilo contemporâneo.',
        price: 159.90,
        promotionalPrice: 139.90,
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85'],
        categoryId: 'cat-lum-1',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [{ name: 'Verde Neon Glow', hex: '#0df5a4' }, { name: 'Deep Cyber Black', hex: '#080809' }, { name: 'Branco Puro', hex: '#ffffff' }],
        composition: '92% Poliamida Tecnológica Dry, 8% Elastano Nobre',
        fit: 'Modern Athletic Fit',
        washCare: 'Lavagem suave à máquina (até 30°C). Não passar a ferro quente.',
        available: true,
        featured: true,
        isNew: true
      },
      {
        id: 'lum-2',
        sku: 'LUM-HOD-002',
        name: 'Hoodie Futurewear Reflective 420g',
        slug: 'hoodie-futurewear-reflective-420g',
        description: 'Moletom 3 cabos 420g com forro peluciado macio, capuz duplo estruturado e estampa minimalista com pigmento refletivo no escuro. O equilíbrio ideal entre conforto térmico e vanguarda.',
        price: 319.90,
        promotionalPrice: 289.90,
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&q=85', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=85'],
        categoryId: 'cat-lum-2',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [{ name: 'Deep Cyber Black', hex: '#080809' }, { name: 'Neon Accent', hex: '#0df5a4' }],
        composition: '80% Algodão Premium, 20% Fibras Térmicas Respiráveis',
        fit: 'Boxy Oversized Fit',
        washCare: 'Lavar do avesso em água fria. Secar à sombra.',
        available: true,
        featured: true,
        isNew: true
      },
      {
        id: 'lum-3',
        sku: 'LUM-CAR-003',
        name: 'Calça Jogger Tática Ripstop Lume',
        slug: 'calca-jogger-tatica-ripstop-lume',
        description: 'Calça utilitária em tecido ripstop militar com acabamento repelente a respingos e rasgos. 6 bolsos ergonômicos, cintura com cordão embutido e ajuste nos tornozelos.',
        price: 269.90,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=85'],
        categoryId: 'cat-lum-3',
        sizes: ['38', '40', '42', '44'],
        colors: [{ name: 'All Black Tático', hex: '#080809' }, { name: 'Cinza Titânio', hex: '#27272a' }],
        composition: '100% Algodão Ripstop Estruturado',
        fit: 'Ergonomic Tapered Fit',
        washCare: 'Lavagem em máquina até 40°C.',
        available: true,
        featured: true,
        isNew: false
      },
      {
        id: 'lum-4',
        sku: 'LUM-JKT-004',
        name: 'Corta-Vento Cyber Shield Impermeável',
        slug: 'corta-vento-cyber-shield-impermeavel',
        description: 'Jaqueta corta-vento ultraleve corta-frio com membrana impermeável e zíper selado emborrachado. Pesa apenas 220g e acompanha bolsinho integrado para transporte compacto.',
        price: 249.90,
        promotionalPrice: 219.90,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1000&q=85'],
        categoryId: 'cat-lum-4',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [{ name: 'Deep Cyber Black', hex: '#080809' }, { name: 'Verde Neon Details', hex: '#0df5a4' }],
        composition: '100% Nylon Ultralight Shield Ripstop',
        fit: 'Athletic Slim Fit',
        washCare: 'Não passar a ferro. Lavagem rápida com sabão neutro.',
        available: true,
        featured: true,
        isNew: true
      }
    ]
  },

  oliveira: {
    id: 'oliveira',
    name: 'Oliveira',
    segment: 'Fitness & Casual',
    badge: 'MODA ESPORTIVA',
    tagline: 'MODA ESPORTIVA E CASUAL',
    description: 'Moda esportiva e casual masculina e feminina. Peças com máxima elasticidade, respirabilidade e caimento impecável para treinos intensos e uso diário.',
    aboutEyebrow: 'A MARCA',
    aboutTitle: 'Performance no treino. Estilo nos passeios.',
    aboutText: 'A Oliveira cria peças esportivas e casuais masculinas e femininas com tecidos inteligentes, respirabilidade e caimento impecável. Do treino pesado na academia aos momentos casuais de lazer, viva o seu melhor estilo com máxima atitude.',
    heroImage: '/images/hero-couple-fitness.jpg',
    logoUrl: '/images/oliveira-icon.png',
    fullLogoUrl: '/images/oliveira-logo.png',
    whatsappNumber: '5511963041542',
    whatsappFormatted: '+55 11 96304-1542',
    email: 'contato@oliveiramoda.com.br',
    businessHours: 'Segunda a Sábado — 09:00 às 19:00',
    primaryColor: '#CCA45E',
    primaryContrast: '#0A152E',
    secondaryColor: '#CBD5E1',
    backgroundColor: '#0A152E',
    sectionBg: '#0A152E',
    headerBg: 'rgba(10, 21, 46, 0.98)',
    headerBorder: 'rgba(204, 164, 94, 0.2)',
    perks: [
      { title: 'TECNOLOGIA DRY & FLEX', desc: 'Tecidos respiráveis de alta elasticidade e conforto térmico' },
      { title: 'ACADEMIA & PASSEIOS', desc: 'Modelagens versáteis do treino pesado ao dia a dia' }
    ],
    categories: [
      {
        id: 'cat-fit-1',
        name: 'Camisetas & Tops',
        slug: 'camisetas-tops',
        description: 'Camisetas dry-fit, regatas e tops para treino intenso e uso casual.',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80'
      },
      {
        id: 'cat-fit-2',
        name: 'Calças & Leggings',
        slug: 'calcas-leggings',
        description: 'Leggings modeladoras de alta compressão e calças joggers esportivas.',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80'
      },
      {
        id: 'cat-fit-3',
        name: 'Casacos & Corta-Ventos',
        slug: 'casacos-jaquetas',
        description: 'Windbreakers, jaquetas esportivas e agasalhos para treino e passeios.',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'
      },
      {
        id: 'cat-fit-4',
        name: 'Bermudas & Shorts',
        slug: 'bermudas-shorts',
        description: 'Bermudas 2 em 1 de compressão e shorts leves para treino e lazer.',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80'
      }
    ],
    products: [
      {
        id: 'oli-1',
        sku: 'OLI-CAM-001',
        name: 'Camiseta Dry-Fit Tech Performance',
        slug: 'camiseta-dry-fit-tech-performance',
        description: 'Camiseta masculina de alta performance em microfibra dry com elastano. Respirabilidade máxima, secagem ultrarrápida e proteção UV50+.',
        price: 139.90,
        promotionalPrice: 119.90,
        images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=85', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=85'],
        categoryId: 'cat-fit-1',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [{ name: 'Azul Marinho', hex: '#0a152e' }, { name: 'Branco Puro', hex: '#ffffff' }, { name: 'Dourado Nobre', hex: '#cca45e' }],
        composition: '90% Poliamida Dry, 10% Elastano',
        fit: 'Slim Athletic Fit',
        washCare: 'Lavagem suave à máquina (até 30°C). Não secar em secadora.',
        available: true,
        featured: true,
        isNew: true
      },
      {
        id: 'oli-2',
        sku: 'OLI-TOP-002',
        name: 'Top Fitness Cross Back Sustentação',
        slug: 'top-fitness-cross-back-sustentacao',
        description: 'Top fitness feminino com alças cruzadas nas costas para distribuição anatômica de peso. Média compressão e bojo removível.',
        price: 119.90,
        promotionalPrice: 99.90,
        images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1000&q=85', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&q=85'],
        categoryId: 'cat-fit-1',
        sizes: ['P', 'M', 'G'],
        colors: [{ name: 'Azul Marinho', hex: '#0a152e' }, { name: 'Off-White', hex: '#f8fafc' }],
        composition: '84% Poliamida, 16% Spandex com Proteção UV',
        fit: 'Alta Sustentação Anatômica',
        washCare: 'Lavar à mão ou em saquinho protetor.',
        available: true,
        featured: true,
        isNew: true
      },
      {
        id: 'oli-3',
        sku: 'OLI-LEG-003',
        name: 'Legging Esculp Safe Cintura Alta',
        slug: 'legging-esculp-safe-cintura-alta',
        description: 'Legging com compressão estratégica que modela sem apertar. Tecido encorpado zero transparência com bolso invisível para celular.',
        price: 189.90,
        images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1000&q=85'],
        categoryId: 'cat-fit-2',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [{ name: 'Preto Intenso', hex: '#0a0a0a' }, { name: 'Azul Marinho', hex: '#0a152e' }],
        composition: '78% Poliamida, 22% Elastano Power',
        fit: 'Compressão Modeladora',
        washCare: 'Lavagem delicada em água fria.',
        available: true,
        featured: true,
        isNew: false
      },
      {
        id: 'oli-4',
        sku: 'OLI-BER-004',
        name: 'Bermuda 2 em 1 Force com Compressão Interna',
        slug: 'bermuda-2-em-1-force-compressao',
        description: 'Bermuda masculina com forro interno de compressão anti-atrito e bolso celular. Camada externa leve e respirável.',
        price: 149.90,
        images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=1000&q=85'],
        categoryId: 'cat-fit-4',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [{ name: 'Preto Grafite', hex: '#18181b' }],
        composition: '92% Poliéster reciclado, 8% Elastano',
        fit: 'Regular com Bermuda Interna Compression',
        washCare: 'Lavar à máquina em ciclo rápido.',
        available: true,
        featured: true,
        isNew: false
      }
    ]
  },

  barone: {
    id: 'barone',
    name: 'Barone Imports',
    segment: 'Streetwear & Urban Culture',
    badge: 'CULTURA URBANA',
    tagline: 'HEAVYWEIGHT STREETWEAR',
    description: 'Moda de rua autêntica, modelagens oversized e tecidos heavyweight 240g/m² desenvolvidos para o homem contemporâneo. Estilo que dita as regras nas ruas.',
    aboutEyebrow: 'MANIFESTO STREET',
    aboutTitle: 'Do asfalto para o mundo. Atitude heavyweight.',
    aboutText: 'A Barone Imports traduz a cultura urbana com tecidos encorpados de alta gramatura, caimento boxy oversized e estética minimalista de impacto visual.',
    heroImage: '/images/hero-streetwear.jpg',
    logoUrl: '/images/barone-logo.png',
    fullLogoUrl: '/images/barone-logo.png',
    whatsappNumber: '5511999990001',
    whatsappFormatted: '+55 11 99999-0001',
    email: 'drops@baronestore.com.br',
    businessHours: 'Segunda a Sábado — 10:00 às 20:00',
    primaryColor: '#FFFFFF',
    primaryContrast: '#000000',
    secondaryColor: '#E63946',
    backgroundColor: '#080809',
    sectionBg: '#080809',
    headerBg: 'rgba(8, 8, 9, 0.98)',
    headerBorder: 'rgba(255, 255, 255, 0.15)',
    perks: [
      { title: 'HEAVYWEIGHT COTTON 240G', desc: 'Tecidos encorpados com caimento estruturado e lavagem acid' },
      { title: 'DROPS & EDIÇÃO LIMITADA', desc: 'Lotes numerados e modelagens exclusivas boxy fit' }
    ],
    categories: [
      {
        id: 'cat-st-1',
        name: 'Camisetas Oversized',
        slug: 'camisetas-oversized',
        description: 'Tees de alta gramatura com caimento boxy e gola canelada 3cm.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80'
      },
      {
        id: 'cat-st-2',
        name: 'Hoodies & Agasalhos',
        slug: 'hoodies-agasalhos',
        description: 'Moletons 3 cabos pesados flanelados com capuz duplo estruturado.',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80'
      },
      {
        id: 'cat-st-3',
        name: 'Calças Cargo & Jogger',
        slug: 'calcas-cargo',
        description: 'Calças utilitárias com bolsos fole e ajuste anatômico nos tornozelos.',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'
      }
    ],
    products: [
      {
        id: 'bar-1',
        sku: 'BAR-TEE-001',
        name: 'Camiseta Boxy Heavyweight 240g Black',
        slug: 'camiseta-boxy-heavyweight-240g-black',
        description: 'Camiseta oversized confeccionada em malha premium 100% algodão penteado 240g. Gola canelada 3cm anti-esgarçamento e caimento boxy imponente.',
        price: 159.90,
        promotionalPrice: 139.90,
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85'],
        categoryId: 'cat-st-1',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [{ name: 'Preto Intenso', hex: '#080809' }, { name: 'Off-White Acid', hex: '#e4e4e7' }],
        composition: '100% Algodão Penteado Heavyweight 240g',
        fit: 'Boxy Oversized Fit',
        washCare: 'Lavar do avesso em água fria. Não passar sobre as estampas.',
        available: true,
        featured: true,
        isNew: true
      },
      {
        id: 'bar-2',
        sku: 'BAR-HOD-002',
        name: 'Hoodie Acid Wash Heavyweight 400g',
        slug: 'hoodie-acid-wash-heavyweight-400g',
        description: 'Moletom 3 cabos 400g com lavagem estonada acid wash exclusiva. Capuz estruturado sem cordão e bolso canguru embutido.',
        price: 289.90,
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&q=85'],
        categoryId: 'cat-st-2',
        sizes: ['M', 'G', 'GG'],
        colors: [{ name: 'Cinza Grafite Acid', hex: '#27272a' }, { name: 'Preto Vintage', hex: '#18181b' }],
        composition: '80% Algodão, 20% Poliéster Encorpado',
        fit: 'Drop Shoulder Relaxed',
        washCare: 'Lavagem suave com sabão neutro. Secar na horizontal.',
        available: true,
        featured: true,
        isNew: true
      },
      {
        id: 'bar-3',
        sku: 'BAR-CAR-003',
        name: 'Calça Cargo Utilitária Tática Ripstop',
        slug: 'calca-cargo-utilitaria-tatica-ripstop',
        description: 'Calça cargo em sarja ripstop militar com 6 bolsos amplos, cordão de ajuste e reforço de costura dupla nos joelhos.',
        price: 249.90,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=85'],
        categoryId: 'cat-st-3',
        sizes: ['38', '40', '42', '44'],
        colors: [{ name: 'All Black', hex: '#080809' }, { name: 'Verde Oliva Militar', hex: '#3f4238' }],
        composition: '100% Algodão Ripstop Militar',
        fit: 'Loose Tapered Leg',
        washCare: 'Lavar à máquina até 40°C.',
        available: true,
        featured: true,
        isNew: false
      }
    ]
  },

  mare: {
    id: 'mare',
    name: 'Maré',
    segment: 'Resort & Beachwear',
    badge: 'ALTO VERÃO',
    tagline: 'RESORT & CASUAL LINEN',
    description: 'Fibras naturais de puro linho europeu, alfaiataria leve e modelagens fluidas pensadas para os dias de sol, momentos de lazer e o pós-praia com sofisticação.',
    aboutEyebrow: 'ALTO VERÃO',
    aboutTitle: 'A brisa do litoral em cada detalhe.',
    aboutText: 'A Maré nasce da união entre o frescor das praias e o requinte da alfaiataria leve. Roupas respiráveis em linho e algodão nobre para quem vive o verão o ano inteiro.',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85',
    logoUrl: '/images/oliveira-icon.png',
    fullLogoUrl: '/images/oliveira-logo.png',
    whatsappNumber: '5581988880002',
    whatsappFormatted: '+55 81 98888-0002',
    email: 'contato@mareresort.com.br',
    businessHours: 'Segunda a Sábado — 09:00 às 18:00',
    primaryColor: '#C15C3D',
    primaryContrast: '#FFFFFF',
    secondaryColor: '#D4A373',
    backgroundColor: '#1A1210',
    sectionBg: '#1A1210',
    headerBg: 'rgba(26, 18, 16, 0.98)',
    headerBorder: 'rgba(193, 92, 61, 0.25)',
    perks: [
      { title: '100% LINHO PURO EUROPEU', desc: 'Fibras naturais pré-lavadas com toque macio e respirável' },
      { title: 'ACABAMENTO ARTESANAL', desc: 'Botões em madeira nobre e cortes fluidos atemporais' }
    ],
    categories: [
      {
        id: 'cat-mar-1',
        name: 'Camisas de Linho',
        slug: 'camisas-linho',
        description: 'Camisas gola padre e gola cubana em puro linho pré-lavado.',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80'
      },
      {
        id: 'cat-mar-2',
        name: 'Bermudas & Shorts Resort',
        slug: 'shorts-resort',
        description: 'Shorts de alfaiataria em linho e sarja leve para o pós-praia.',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80'
      }
    ],
    products: [
      {
        id: 'mar-1',
        sku: 'MAR-CAM-001',
        name: 'Camisa Gola Cubana em Linho Puro Terracota',
        slug: 'camisa-gola-cubana-linho-puro-terracota',
        description: 'Camisa manga curta em 100% linho puro pré-encolhido com gola cubana retrô e botões ecológicos de coco. Caimento fluído e toque super fresco.',
        price: 219.90,
        promotionalPrice: 189.90,
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&q=85', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&q=85'],
        categoryId: 'cat-mar-1',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [{ name: 'Terracota Solar', hex: '#c15c3d' }, { name: 'Areia Natural', hex: '#d4a373' }, { name: 'Branco Linho', hex: '#fdfbf7' }],
        composition: '100% Linho Europeu Puro Certificado',
        fit: 'Resort Relaxed Fit',
        washCare: 'Lavagem suave à mão ou máquina até 30°C. Secar à sombra.',
        available: true,
        featured: true,
        isNew: true
      },
      {
        id: 'mar-2',
        sku: 'MAR-BER-002',
        name: 'Short Alfaiataria Resort Cordão Natural',
        slug: 'short-alfaiataria-resort-cordao-natural',
        description: 'Short leve com cós elástico anatômico e cordão em algodão cru trançado. Dois bolsos frontais alfaiataria e bolso traseiro com lapela.',
        price: 169.90,
        images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=1000&q=85'],
        categoryId: 'cat-mar-2',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [{ name: 'Areia Natural', hex: '#d4a373' }, { name: 'Azul Mediterrâneo', hex: '#264653' }],
        composition: '55% Linho, 45% Algodão Nobre',
        fit: 'Conforto Moderno Acima do Joelho',
        washCare: 'Lavagem suave. Passar a ferro brando.',
        available: true,
        featured: true,
        isNew: true
      }
    ]
  },

  terra_forte: {
    id: 'terra_forte',
    name: 'Terra Forte',
    segment: 'Moda Country & Vaquejada',
    badge: 'ESTILO SERTANEJO',
    tagline: 'MODA COUNTRY & COURO NOBRE',
    description: 'Camisas estruturadas em algodão encorpado, jaquetas em couro legítimo e chapéus moldados para quem vive o campo, a vaquejada e os grandes rodeios.',
    aboutEyebrow: 'TRADIÇÃO & CAMPO',
    aboutTitle: 'A autenticidade da vaquejada com elegância.',
    aboutText: 'A Terra Forte veste quem tem paixão pela terra, cavalos e tradição sertaneja. Roupas com costura reforçada e matéria-prima selecionada para aguentar a lida e brilhar na festa.',
    heroImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&q=85',
    logoUrl: '/vaquejada.png',
    fullLogoUrl: '/vaquejada.png',
    whatsappNumber: '5587977770003',
    whatsappFormatted: '+55 87 97777-0003',
    email: 'vendas@terrafortecountry.com.br',
    businessHours: 'Segunda a Sábado — 08:00 às 18:00',
    primaryColor: '#D97706',
    primaryContrast: '#FFFFFF',
    secondaryColor: '#B45309',
    backgroundColor: '#140E0A',
    sectionBg: '#140E0A',
    headerBg: 'rgba(20, 14, 10, 0.98)',
    headerBorder: 'rgba(217, 119, 6, 0.25)',
    perks: [
      { title: 'COURO BOVINO 100% LEGÍTIMO', desc: 'Trabalho artesanal com acabamento reforçado de alta durabilidade' },
      { title: 'RESISTÊNCIA & TRADIÇÃO', desc: 'Modelagens autênticas desenhadas para o campo e eventos' }
    ],
    categories: [
      {
        id: 'cat-tf-1',
        name: 'Camisas Country & Xadrez',
        slug: 'camisas-country',
        description: 'Camisas western estruturadas com botões de pressão e pala bordada.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80'
      },
      {
        id: 'cat-tf-2',
        name: 'Couro Nobre & Jaquetas',
        slug: 'jaquetas-couro',
        description: 'Jaquetas em couro legítimo amaciado e coletes resistentes.',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'
      }
    ],
    products: [
      {
        id: 'tf-1',
        sku: 'TF-CAM-001',
        name: 'Camisa Western Tradicional Sarja Âmbar',
        slug: 'camisa-western-tradicional-sarja-ambar',
        description: 'Camisa western em sarja de algodão encorpada com costura tripla reforçada, botões de pressão perolados e pala clássica de vaquejada.',
        price: 199.90,
        promotionalPrice: 179.90,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=85', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=85'],
        categoryId: 'cat-tf-1',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [{ name: 'Âmbar Dourado', hex: '#d97706' }, { name: 'Azul Petróleo Western', hex: '#1e3a5f' }],
        composition: '100% Algodão Encorpado 210g',
        fit: 'Western Comfort Fit',
        washCare: 'Lavagem à máquina até 40°C. Não alvejar.',
        available: true,
        featured: true,
        isNew: true
      },
      {
        id: 'tf-2',
        sku: 'TF-JAC-002',
        name: 'Jaqueta Bomber Couro Bovino Rústico',
        slug: 'jaqueta-bomber-couro-bovino-rustico',
        description: 'Jaqueta produzida artesanalmente em couro legítimo atanado com forro interno térmico acetinado e metais antioxidantes.',
        price: 890.00,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1000&q=85'],
        categoryId: 'cat-tf-2',
        sizes: ['M', 'G', 'GG'],
        colors: [{ name: 'Marrom Tabaco', hex: '#451a03' }, { name: 'Preto Rústico', hex: '#1c1917' }],
        composition: '100% Couro Bovino Legítimo, Forro 100% Poliéster',
        fit: 'Regular Estruturado',
        washCare: 'Limpeza especializada em couro. Hidratar periodicamente.',
        available: true,
        featured: true,
        isNew: true
      }
    ]
  },

  atelier_aura: {
    id: 'atelier_aura',
    name: 'Atelier Aura',
    segment: 'Alfaiataria & Luxo Minimalista',
    badge: 'ALTA COSTURA',
    tagline: 'CONTEMPORARY LUXURY',
    description: 'Alfaiataria estruturada de precisão, proporções amplas e tecidos nobres italianos. O ápice da sofisticação silenciosa para o guarda-roupa contemporâneo.',
    aboutEyebrow: 'CONTEMPORARY TAILORING',
    aboutTitle: 'Design silencioso. Matéria-prima impecável.',
    aboutText: 'O Atelier Aura explora o corte perfeito, linhas limpas e tecidos excepcionais. Peças de presença sutil criadas para ultrapassar temporadas com máxima elegância.',
    heroImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85',
    logoUrl: '/images/oliveira-icon.png',
    fullLogoUrl: '/images/oliveira-logo.png',
    whatsappNumber: '5511955550004',
    whatsappFormatted: '+55 11 95555-0004',
    email: 'concierge@atelier-aura.com',
    businessHours: 'Segunda a Sábado — 10:00 às 20:00 (Com agendamento)',
    primaryColor: '#F5F5F7',
    primaryContrast: '#0E0E10',
    secondaryColor: '#D1D5DB',
    backgroundColor: '#0E0E10',
    sectionBg: '#0E0E10',
    headerBg: 'rgba(14, 14, 16, 0.98)',
    headerBorder: 'rgba(255, 255, 255, 0.15)',
    perks: [
      { title: 'ALFAIATARIA DE PRECISÃO', desc: 'Cortes limpos, ombreiras estruturadas e caimento fluido' },
      { title: 'TECIDOS NOBRES IMPORTADOS', desc: 'Lã fria, seda pura e acabamentos manuais de alfaiate' }
    ],
    categories: [
      {
        id: 'cat-aur-1',
        name: 'Blazers & Alfaiataria',
        slug: 'blazers-alfaiataria',
        description: 'Blazers estruturados e paletós sob medida contemporâneos.',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80'
      },
      {
        id: 'cat-aur-2',
        name: 'Pantalonas & Calças Nobres',
        slug: 'calcas-nobres',
        description: 'Pantalonas de cós alto com pregas duplas e caimento arquitetônico.',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80'
      }
    ],
    products: [
      {
        id: 'aur-1',
        sku: 'AUR-BLZ-001',
        name: 'Blazer Estruturado em Lã Fria Super 120s',
        slug: 'blazer-estruturado-la-fria-super-120s',
        description: 'Blazer de alfaiataria em lã fria italiana Super 120s com meio forro de seda, ombreiras sutis e lapela notched de proporções impecáveis.',
        price: 980.00,
        promotionalPrice: 890.00,
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&q=85', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1000&q=85'],
        categoryId: 'cat-aur-1',
        sizes: ['38', '40', '42', '44'],
        colors: [{ name: 'Preto Grafite', hex: '#0e0e10' }, { name: 'Off-White Giz', hex: '#f5f5f7' }],
        composition: '98% Lã Fria Italiana Super 120s, 2% Elastano Nobre',
        fit: 'Tailored Precision Fit',
        washCare: 'Lavagem a seco especializada em alfaiataria.',
        available: true,
        featured: true,
        isNew: true
      },
      {
        id: 'aur-2',
        sku: 'AUR-PAN-002',
        name: 'Pantalona Ampla Pregas Duplas Alfaiataria',
        slug: 'pantalona-ampla-pregas-duplas-alfaiataria',
        description: 'Pantalona fluída com pregas duplas frontais, bolsos faca e acabamento interno de alfaiataria tradicional. Caimento alongado e refinado.',
        price: 520.00,
        images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=85'],
        categoryId: 'cat-aur-2',
        sizes: ['36', '38', '40', '42'],
        colors: [{ name: 'Preto Ônix', hex: '#0e0e10' }, { name: 'Pérola Acetinado', hex: '#e5e7eb' }],
        composition: '70% Viscose Nobre, 30% Linho com toque de seda',
        fit: 'High-Waist Wide Leg',
        washCare: 'Lavagem suave ou limpeza a seco.',
        available: true,
        featured: true,
        isNew: true
      }
    ]
  }
};
