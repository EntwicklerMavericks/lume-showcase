import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DEMO_THEMES, DemoThemeConfig } from '../config/demo-themes';
import { Category, Product, ProductColor } from '../models/store.models';
import { ThemeService } from './theme.service';

const STORAGE_THEME_ID = 'lume_showcase_theme_id';
const STORAGE_CUSTOM_BRAND = 'lume_showcase_custom_brand';
const STORAGE_PRODUCTS = 'lume_showcase_products';
const STORAGE_CATEGORIES = 'lume_showcase_categories';
const STORAGE_ORDERS = 'lume_showcase_orders';
const STORAGE_CUSTOMERS = 'lume_showcase_customers';

export interface CustomBranding {
  name?: string;
  tagline?: string;
  description?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  sectionBg?: string;
  whatsappNumber?: string;
  whatsappFormatted?: string;
  logoUrl?: string;
  heroImage?: string;
  // Endereço e Configuração de Frete
  email?: string;
  phone?: string;
  postalCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  pacBaseRate?: number;
  sedexBaseRate?: number;
  freeShippingMin?: number;
}

export interface DemoOrder {
  id: string;
  orderNumber?: string;
  client: string;
  email?: string;
  phone?: string;
  cpf?: string;
  date: string;
  total: number;
  subtotal?: number;
  shippingCost?: number;
  shippingMethod?: string;
  status: 'paid' | 'pending' | 'pending_payment' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  statusLabel: string;
  itemsCount: number;
  paymentMethod?: 'PIX' | 'CREDIT_CARD';
  trackingCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  items?: any[];
  pix?: {
    qrCodeImage: string;
    copiaECola: string;
    expiresAt: string;
  };
}

export interface DemoCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  address?: string;
  purchasesCount?: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  lastPurchase?: string;
}

const DEFAULT_ORDERS: DemoOrder[] = [
  {
    id: 'ord-1024',
    orderNumber: '1024',
    client: 'Marcos Vinícius Silva',
    email: 'marcos@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    date: 'Hoje, 14:32',
    total: 389.70,
    subtotal: 359.80,
    shippingCost: 29.90,
    shippingMethod: 'Correios SEDEX',
    status: 'paid',
    statusLabel: 'Pago',
    itemsCount: 3,
    paymentMethod: 'PIX',
    trackingCode: 'BR847291039SL',
    street: 'Av. Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310-100',
    items: [
      { id: 'item-1', name: 'Camiseta Performance Dry-Fit', sku: 'LUM-TSH-001', quantity: 2, price: 119.90, total: 239.80, size: 'M', color: 'Azul' },
      { id: 'item-2', name: 'Meia Esportiva Alta Compressão', sku: 'LUM-ACC-004', quantity: 1, price: 120.00, total: 120.00, size: 'U', color: 'Preto' }
    ]
  },
  {
    id: 'ord-1023',
    orderNumber: '1023',
    client: 'Fernanda Lima Castro',
    email: 'fernanda@email.com',
    phone: '(21) 97654-3210',
    cpf: '987.654.321-99',
    date: 'Hoje, 11:15',
    total: 649.90,
    subtotal: 620.00,
    shippingCost: 29.90,
    shippingMethod: 'Correios PAC',
    status: 'shipped',
    statusLabel: 'Enviado',
    itemsCount: 2,
    paymentMethod: 'CREDIT_CARD',
    trackingCode: 'BR912384756SL',
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Leblon',
    city: 'Rio de Janeiro',
    state: 'RJ',
    postalCode: '22440-032',
    items: [
      { id: 'item-1', name: 'Jaqueta Bomber Tech Waterproof', sku: 'LUM-JAC-003', quantity: 1, price: 620.00, total: 620.00, size: 'G', color: 'Preto' }
    ]
  },
  {
    id: 'ord-1022',
    orderNumber: '1022',
    client: 'Rafael Albuquerque',
    email: 'rafael@email.com',
    phone: '(31) 99887-7665',
    cpf: '456.789.123-11',
    date: 'Ontem, 17:45',
    total: 219.90,
    subtotal: 199.90,
    shippingCost: 20.00,
    shippingMethod: 'Correios PAC',
    status: 'pending',
    statusLabel: 'Aguardando Pagamento',
    itemsCount: 1,
    paymentMethod: 'PIX',
    street: 'Av. Afonso Pena',
    number: '500',
    neighborhood: 'Centro',
    city: 'Belo Horizonte',
    state: 'MG',
    postalCode: '30130-001',
    items: [
      { id: 'item-1', name: 'Calça Chino Slim Comfort', sku: 'LUM-PAN-002', quantity: 1, price: 199.90, total: 199.90, size: '42', color: 'Cinza' }
    ]
  },
  {
    id: 'ord-1021',
    orderNumber: '1021',
    client: 'Juliana Mendes Rocha',
    email: 'juliana@email.com',
    phone: '(81) 98112-3344',
    cpf: '321.654.987-88',
    date: '21/09, 10:20',
    total: 1120.00,
    subtotal: 1120.00,
    shippingCost: 0.00,
    shippingMethod: 'Frete Grátis',
    status: 'delivered',
    statusLabel: 'Entregue',
    itemsCount: 4,
    paymentMethod: 'CREDIT_CARD',
    trackingCode: 'BR736251940SL',
    street: 'Rua Boa Vista',
    number: '450',
    neighborhood: 'Boa Viagem',
    city: 'Recife',
    state: 'PE',
    postalCode: '51020-010',
    items: [
      { id: 'item-1', name: 'Camiseta Pima Tech Black', sku: 'LUM-TSH-002', quantity: 4, price: 280.00, total: 1120.00, size: 'M', color: 'Preto' }
    ]
  }
];

const DEFAULT_CUSTOMERS: DemoCustomer[] = [
  { id: 'cli-1', name: 'Marcos Vinícius Silva', email: 'marcos@email.com', phone: '(11) 98765-4321', cpf: '123.456.789-00', address: 'Av. Paulista, 1000 - São Paulo/SP', totalOrders: 5, purchasesCount: 5, totalSpent: 1890.50, lastOrderDate: 'Hoje', lastPurchase: 'Hoje, 14:32' },
  { id: 'cli-2', name: 'Fernanda Lima Castro', email: 'fernanda@email.com', phone: '(21) 97654-3210', cpf: '987.654.321-99', address: 'Rua das Flores, 123 - Rio de Janeiro/RJ', totalOrders: 3, purchasesCount: 3, totalSpent: 1240.00, lastOrderDate: 'Hoje', lastPurchase: 'Hoje, 11:15' },
  { id: 'cli-3', name: 'Rafael Albuquerque', email: 'rafael@email.com', phone: '(31) 99887-7665', cpf: '456.789.123-11', address: 'Av. Afonso Pena, 500 - Belo Horizonte/MG', totalOrders: 2, purchasesCount: 2, totalSpent: 480.00, lastOrderDate: 'Ontem', lastPurchase: 'Ontem, 17:45' },
  { id: 'cli-4', name: 'Juliana Mendes Rocha', email: 'juliana@email.com', phone: '(81) 98112-3344', cpf: '321.654.987-88', address: 'Rua Boa Vista, 450 - Recife/PE', totalOrders: 7, purchasesCount: 7, totalSpent: 3450.00, lastOrderDate: '21/09', lastPurchase: '21/09/2026' }
];

@Injectable({
  providedIn: 'root'
})
export class DemoStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeService = inject(ThemeService);

  readonly currentThemeId = signal<string>('lume');
  readonly customBranding = signal<CustomBranding>({});
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly orders = signal<DemoOrder[]>([]);
  readonly customers = signal<DemoCustomer[]>([]);

  /** Configuração ativa completa da loja (fundindo tema base + personalização ao vivo) */
  readonly activeConfig = computed<DemoThemeConfig>(() => {
    const themeId = this.currentThemeId();
    const base = DEMO_THEMES[themeId] || DEMO_THEMES['lume'];
    const custom = this.customBranding();

    const mergedName = custom.name?.trim() ? custom.name.trim() : base.name;
    const mergedPrimary = custom.primaryColor?.trim() ? custom.primaryColor.trim() : base.primaryColor;
    const mergedBackground = custom.backgroundColor?.trim() ? custom.backgroundColor.trim() : base.backgroundColor;
    const mergedSectionBg = custom.sectionBg?.trim() ? custom.sectionBg.trim() : (base.sectionBg || base.backgroundColor);
    const mergedWhatsapp = custom.whatsappNumber?.trim() ? custom.whatsappNumber.trim() : base.whatsappNumber;

    return {
      ...base,
      name: mergedName,
      tagline: custom.tagline?.trim() ? custom.tagline.trim() : base.tagline,
      description: custom.description?.trim() ? custom.description.trim() : base.description,
      primaryColor: mergedPrimary,
      secondaryColor: custom.secondaryColor?.trim() ? custom.secondaryColor.trim() : base.secondaryColor,
      backgroundColor: mergedBackground,
      sectionBg: mergedSectionBg,
      whatsappNumber: mergedWhatsapp,
      whatsappFormatted: custom.whatsappFormatted?.trim() ? custom.whatsappFormatted.trim() : (custom.whatsappNumber ? `+${custom.whatsappNumber}` : base.whatsappFormatted),
      logoUrl: custom.logoUrl || base.logoUrl,
      heroImage: (custom.heroImage && !custom.heroImage.includes('photo-1509631179647-0177331693ae')) ? custom.heroImage : base.heroImage
    };
  });

  constructor() {
    this.initializeFromStorage();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Inicializa o estado a partir do LocalStorage com fallback para o tema Lume padrão.
   */
  private initializeFromStorage(): void {
    if (!this.isBrowser()) return;

    try {
      // 1. Tema atual
      const savedThemeId = localStorage.getItem(STORAGE_THEME_ID);
      const initialThemeId = savedThemeId && DEMO_THEMES[savedThemeId] ? savedThemeId : 'lume';
      this.currentThemeId.set(initialThemeId);

      // 2. Custom branding
      const savedCustom = localStorage.getItem(STORAGE_CUSTOM_BRAND);
      if (savedCustom) {
        this.customBranding.set(JSON.parse(savedCustom));
      }

      // Verifica versão do catálogo para atualizar automaticamente catálogos antigos do storage
      const savedVersion = localStorage.getItem('lume_demo_catalog_version');
      const isCatalogOutdated = savedVersion !== 'v8_all_6_stores_bespoke_studio_2026';

      // 3. Categorias
      const savedCats = localStorage.getItem(STORAGE_CATEGORIES);
      if (savedCats && !isCatalogOutdated) {
        this.categories.set(JSON.parse(savedCats));
      } else {
        const themeCats = DEMO_THEMES[initialThemeId]?.categories || DEMO_THEMES['lume'].categories;
        this.categories.set([...themeCats]);
        localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(themeCats));
      }

      // 4. Produtos
      const savedProds = localStorage.getItem(STORAGE_PRODUCTS);
      if (savedProds && !isCatalogOutdated) {
        this.products.set(JSON.parse(savedProds));
      } else {
        const themeProds = DEMO_THEMES[initialThemeId]?.products || DEMO_THEMES['lume'].products;
        this.products.set([...themeProds]);
        localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(themeProds));
        localStorage.setItem('lume_demo_catalog_version', 'v8_all_6_stores_bespoke_studio_2026');
      }

      // 5. Pedidos e Clientes
      const savedOrders = localStorage.getItem(STORAGE_ORDERS);
      this.orders.set(savedOrders ? JSON.parse(savedOrders) : DEFAULT_ORDERS);

      const savedCustomers = localStorage.getItem(STORAGE_CUSTOMERS);
      this.customers.set(savedCustomers ? JSON.parse(savedCustomers) : DEFAULT_CUSTOMERS);

      // Aplica tema visual inicial
      this.applyActiveThemeStyles();
    } catch (e) {
      console.warn('[DemoStorageService] Erro ao carregar dados do LocalStorage, usando defaults', e);
      this.resetToDefaults();
    }
  }

  /**
   * Aplica cores dinâmicas no documento CSS :root
   */
  applyActiveThemeStyles(): void {
    const config = this.activeConfig();
    this.themeService.applyTheme({
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      backgroundColor: config.backgroundColor,
      sectionBg: config.sectionBg
    });
  }

  /**
   * Alterna para um dos 5 temas nativos.
   * Se replaceCatalog for true, atualiza também a lista de produtos e categorias para as do novo nicho.
   */
  switchTheme(themeId: string, replaceCatalog: boolean = true): void {
    if (!DEMO_THEMES[themeId]) return;

    this.currentThemeId.set(themeId);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_THEME_ID, themeId);
    }

    if (replaceCatalog) {
      const theme = DEMO_THEMES[themeId];
      this.categories.set([...theme.categories]);
      this.products.set([...theme.products]);
      if (this.isBrowser()) {
        localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(theme.categories));
        localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(theme.products));
        localStorage.setItem('lume_demo_catalog_version', 'v8_all_6_stores_bespoke_studio_2026');
      }
    }

    // Limpa branding customizado específico para adotar a identidade visual do novo tema
    this.customBranding.set({});
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_CUSTOM_BRAND);
    }

    this.applyActiveThemeStyles();
  }

  /**
   * Atualiza a identidade visual ao vivo na frente do cliente (nome, cor primária, whatsapp, etc.)
   */
  updateCustomBranding(branding: Partial<CustomBranding>): void {
    const updated = { ...this.customBranding(), ...branding };
    this.customBranding.set(updated);

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_CUSTOM_BRAND, JSON.stringify(updated));
    }

    this.applyActiveThemeStyles();
  }

  /**
   * Restaura todos os dados da demonstração para o padrão original (Lume Oficial).
   */
  resetToDefaults(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_THEME_ID);
      localStorage.removeItem(STORAGE_CUSTOM_BRAND);
      localStorage.removeItem(STORAGE_PRODUCTS);
      localStorage.removeItem(STORAGE_CATEGORIES);
      localStorage.removeItem(STORAGE_ORDERS);
      localStorage.removeItem(STORAGE_CUSTOMERS);
    }

    const defaultTheme = DEMO_THEMES['lume'];
    this.currentThemeId.set('lume');
    this.customBranding.set({});
    this.categories.set([...defaultTheme.categories]);
    this.products.set([...defaultTheme.products]);
    this.orders.set(DEFAULT_ORDERS);
    this.customers.set(DEFAULT_CUSTOMERS);

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_THEME_ID, 'lume');
      localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(defaultTheme.categories));
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(defaultTheme.products));
      localStorage.setItem('lume_demo_catalog_version', 'v8_all_6_stores_bespoke_studio_2026');
    }

    this.applyActiveThemeStyles();
  }

  // ==========================================
  // OPERAÇÕES DE PRODUTOS (CRUD REATIVO)
  // ==========================================

  getProducts(): Product[] {
    return this.products();
  }

  getProductById(id: string): Product | undefined {
    return this.products().find((p) => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products().find((p) => p.slug === slug);
  }

  createProduct(data: any): Product {
    const id = 'prod-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : id);

    let images: string[] = [];
    if (Array.isArray(data.images) && data.images.length > 0) {
      images = data.images.map((img: any) => typeof img === 'string' ? img : (img.url || ''));
    }
    if (images.length === 0) {
      images = ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=85'];
    }

    // Cores
    let colors: ProductColor[] | undefined = undefined;
    if (Array.isArray(data.colors) && data.colors.length > 0) {
      colors = data.colors.map((c: any) => {
        if (typeof c === 'string') return { name: c, hex: '#111827' };
        return { name: c.name || 'Cor', hex: c.hex || '#111827' };
      });
    }

    const category = this.categories().find((c) => c.id === data.categoryId);

    const newProduct: Product = {
      id,
      sku: data.sku || ('SKU-' + Date.now().toString().slice(-4)),
      name: data.name,
      slug,
      description: data.description || '',
      price: Number(data.price || 0),
      promotionalPrice: data.promotionalPrice || data.pricePromo ? Number(data.promotionalPrice || data.pricePromo) : undefined,
      images,
      categoryId: data.categoryId || '',
      category: category ? {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image
      } : undefined,
      sizes: Array.isArray(data.sizes) ? data.sizes : [],
      colors,
      composition: data.composition,
      fit: data.fit,
      washCare: data.washCare,
      available: data.status !== undefined ? Boolean(data.status) : true,
      featured: Boolean(data.highlight),
      isNew: Boolean(data.newLaunch),
      createdAt: new Date().toISOString()
    };

    const updated = [newProduct, ...this.products()];
    this.products.set(updated);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(updated));
    }
    return newProduct;
  }

  updateProduct(id: string, data: any): Product {
    const list = this.products();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Produto não encontrado com id ${id}`);
    }

    const current = list[index];

    let images = current.images;
    if (Array.isArray(data.images)) {
      images = data.images.map((img: any) => typeof img === 'string' ? img : (img.url || ''));
    }

    let colors = current.colors;
    if (Array.isArray(data.colors)) {
      colors = data.colors.map((c: any) => {
        if (typeof c === 'string') return { name: c, hex: '#111827' };
        return { name: c.name || 'Cor', hex: c.hex || '#111827' };
      });
    }

    const category = data.categoryId ? this.categories().find((c) => c.id === data.categoryId) : current.category;

    const updatedProduct: Product = {
      ...current,
      sku: data.sku !== undefined ? data.sku : current.sku,
      name: data.name !== undefined ? data.name : current.name,
      description: data.description !== undefined ? data.description : current.description,
      price: data.price !== undefined ? Number(data.price) : current.price,
      promotionalPrice: data.promotionalPrice !== undefined ? (data.promotionalPrice ? Number(data.promotionalPrice) : undefined) : (data.pricePromo !== undefined ? (data.pricePromo ? Number(data.pricePromo) : undefined) : current.promotionalPrice),
      images: images && images.length > 0 ? images : current.images,
      categoryId: data.categoryId !== undefined ? data.categoryId : current.categoryId,
      category: category ? {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image
      } : current.category,
      sizes: data.sizes !== undefined ? (Array.isArray(data.sizes) ? data.sizes : []) : current.sizes,
      colors,
      composition: data.composition !== undefined ? data.composition : current.composition,
      fit: data.fit !== undefined ? data.fit : current.fit,
      washCare: data.washCare !== undefined ? data.washCare : current.washCare,
      available: data.status !== undefined ? Boolean(data.status) : current.available,
      featured: data.highlight !== undefined ? Boolean(data.highlight) : current.featured,
      isNew: data.newLaunch !== undefined ? Boolean(data.newLaunch) : current.isNew,
      createdAt: current.createdAt || new Date().toISOString()
    };

    const nextList = [...list];
    nextList[index] = updatedProduct;
    this.products.set(nextList);

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(nextList));
    }

    return updatedProduct;
  }

  toggleProductStatus(id: string): Product {
    const product = this.getProductById(id);
    if (!product) throw new Error('Produto não encontrado');
    return this.updateProduct(id, { status: !product.available });
  }

  deleteProduct(id: string): boolean {
    const list = this.products().filter((p) => p.id !== id);
    this.products.set(list);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(list));
    }
    return true;
  }

  // ==========================================
  // OPERAÇÕES DE CATEGORIAS (CRUD REATIVO)
  // ==========================================

  getCategories(): Category[] {
    return this.categories();
  }

  createCategory(data: Partial<Category>): Category {
    const id = 'cat-' + Date.now().toString(36);
    const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : id);

    const newCategory: Category = {
      id,
      name: data.name || 'Nova Categoria',
      slug,
      description: data.description || '',
      image: data.image || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80'
    };

    const updated = [...this.categories(), newCategory];
    this.categories.set(updated);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(updated));
    }
    return newCategory;
  }

  updateCategory(id: string, data: Partial<Category>): Category {
    const list = this.categories();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Categoria não encontrada');

    const updatedCategory: Category = {
      ...list[index],
      ...data
    };

    const nextList = [...list];
    nextList[index] = updatedCategory;
    this.categories.set(nextList);

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(nextList));
    }

    return updatedCategory;
  }

  deleteCategory(id: string): boolean {
    const list = this.categories().filter((c) => c.id !== id);
    this.categories.set(list);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(list));
    }
    return true;
  }

  // ==========================================
  // OPERAÇÕES DE PEDIDOS (DEMO ORDERS)
  // ==========================================

  addOrder(order: DemoOrder): void {
    const updatedOrders = [order, ...this.orders()];
    this.orders.set(updatedOrders);

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(updatedOrders));
    }

    // Atualiza ou adiciona cliente
    if (order.client) {
      const customers = this.customers();
      const existingIdx = customers.findIndex(
        (c) => (order.email && c.email.toLowerCase() === order.email.toLowerCase()) || c.name === order.client
      );

      const customerAddress = order.street
        ? `${order.street}, ${order.number || 'S/N'}${order.complement ? ' • ' + order.complement : ''} - ${order.neighborhood || ''}, ${order.city || ''}/${order.state || ''}`
        : 'Endereço cadastrado no checkout';

      if (existingIdx >= 0) {
        const updated = [...customers];
        const prev = updated[existingIdx];
        const newCount = (prev.totalOrders || prev.purchasesCount || 0) + 1;
        const newSpent = Math.round(((prev.totalSpent || 0) + order.total) * 100) / 100;
        updated[existingIdx] = {
          ...prev,
          phone: order.phone || prev.phone,
          cpf: order.cpf || prev.cpf,
          address: order.street ? customerAddress : (prev.address || customerAddress),
          totalOrders: newCount,
          purchasesCount: newCount,
          totalSpent: newSpent,
          lastOrderDate: 'Hoje',
          lastPurchase: order.date || 'Hoje',
        };
        this.customers.set(updated);
        if (this.isBrowser()) {
          localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(updated));
        }
      } else {
        const newCustomer: DemoCustomer = {
          id: 'cli-' + Date.now().toString(36),
          name: order.client,
          email: order.email || 'cliente@exemplo.com',
          phone: order.phone || '',
          cpf: order.cpf || '',
          address: customerAddress,
          totalOrders: 1,
          purchasesCount: 1,
          totalSpent: order.total,
          lastOrderDate: 'Hoje',
          lastPurchase: order.date || 'Hoje',
        };
        const updated = [newCustomer, ...customers];
        this.customers.set(updated);
        if (this.isBrowser()) {
          localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(updated));
        }
      }
    }
  }

  getOrderById(id: string): DemoOrder | undefined {
    return this.orders().find((o) => o.id === id || o.orderNumber === id);
  }

  updateOrderStatus(id: string, status: any, trackingCode?: string): void {
    const orders = this.orders();
    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index === -1) return;

    const labels: Record<string, string> = {
      paid: 'Pago',
      pending: 'Aguardando Pagamento',
      pending_payment: 'Aguardando Pagamento',
      preparing: 'Em separação',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };

    // Gera código de rastreio automático caso mude para 'shipped' e ainda não tenha
    let generatedTracking = trackingCode || orders[index].trackingCode;
    if (status === 'shipped' && !generatedTracking) {
      generatedTracking = 'BR' + Math.floor(100000000 + Math.random() * 900000000) + 'SL';
    }

    const updated = [...orders];
    updated[index] = {
      ...updated[index],
      status,
      statusLabel: labels[status] || status,
      trackingCode: generatedTracking,
    };

    this.orders.set(updated);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(updated));
    }
  }
}
