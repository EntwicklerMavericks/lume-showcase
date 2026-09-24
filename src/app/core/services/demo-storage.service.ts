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
  whatsappNumber?: string;
  whatsappFormatted?: string;
  logoUrl?: string;
  heroImage?: string;
}

export interface DemoOrder {
  id: string;
  client: string;
  email?: string;
  phone?: string;
  date: string;
  total: number;
  status: 'paid' | 'pending' | 'shipped' | 'cancelled';
  statusLabel: string;
  itemsCount: number;
}

export interface DemoCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

const DEFAULT_ORDERS: DemoOrder[] = [
  { id: '#1024', client: 'Marcos Vinícius Silva', email: 'marcos@email.com', phone: '(11) 98765-4321', date: 'Hoje, 14:32', total: 389.70, status: 'paid', statusLabel: 'Pago', itemsCount: 3 },
  { id: '#1023', client: 'Fernanda Lima Castro', email: 'fernanda@email.com', phone: '(21) 97654-3210', date: 'Hoje, 11:15', total: 649.90, status: 'shipped', statusLabel: 'Enviado', itemsCount: 2 },
  { id: '#1022', client: 'Rafael Albuquerque', email: 'rafael@email.com', phone: '(31) 99887-7665', date: 'Ontem, 17:45', total: 219.90, status: 'pending', statusLabel: 'Aguardando Pagamento', itemsCount: 1 },
  { id: '#1021', client: 'Juliana Mendes Rocha', email: 'juliana@email.com', phone: '(81) 98112-3344', date: '21/09, 10:20', total: 1120.00, status: 'paid', statusLabel: 'Pago', itemsCount: 4 }
];

const DEFAULT_CUSTOMERS: DemoCustomer[] = [
  { id: 'cli-1', name: 'Marcos Vinícius Silva', email: 'marcos@email.com', phone: '(11) 98765-4321', totalOrders: 5, totalSpent: 1890.50, lastOrderDate: 'Hoje' },
  { id: 'cli-2', name: 'Fernanda Lima Castro', email: 'fernanda@email.com', phone: '(21) 97654-3210', totalOrders: 3, totalSpent: 1240.00, lastOrderDate: 'Hoje' },
  { id: 'cli-3', name: 'Rafael Albuquerque', email: 'rafael@email.com', phone: '(31) 99887-7665', totalOrders: 2, totalSpent: 480.00, lastOrderDate: 'Ontem' },
  { id: 'cli-4', name: 'Juliana Mendes Rocha', email: 'juliana@email.com', phone: '(81) 98112-3344', totalOrders: 7, totalSpent: 3450.00, lastOrderDate: '21/09' }
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
    const mergedWhatsapp = custom.whatsappNumber?.trim() ? custom.whatsappNumber.trim() : base.whatsappNumber;

    return {
      ...base,
      name: mergedName,
      tagline: custom.tagline?.trim() ? custom.tagline.trim() : base.tagline,
      description: custom.description?.trim() ? custom.description.trim() : base.description,
      primaryColor: mergedPrimary,
      secondaryColor: custom.secondaryColor?.trim() ? custom.secondaryColor.trim() : base.secondaryColor,
      backgroundColor: mergedBackground,
      whatsappNumber: mergedWhatsapp,
      whatsappFormatted: custom.whatsappFormatted?.trim() ? custom.whatsappFormatted.trim() : (custom.whatsappNumber ? `+${custom.whatsappNumber}` : base.whatsappFormatted),
      logoUrl: custom.logoUrl || base.logoUrl,
      heroImage: custom.heroImage || base.heroImage
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

      // 3. Categorias
      const savedCats = localStorage.getItem(STORAGE_CATEGORIES);
      if (savedCats) {
        this.categories.set(JSON.parse(savedCats));
      } else {
        const themeCats = DEMO_THEMES[initialThemeId]?.categories || DEMO_THEMES['lume'].categories;
        this.categories.set(themeCats);
        localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(themeCats));
      }

      // 4. Produtos
      const savedProds = localStorage.getItem(STORAGE_PRODUCTS);
      if (savedProds) {
        this.products.set(JSON.parse(savedProds));
      } else {
        const themeProds = DEMO_THEMES[initialThemeId]?.products || DEMO_THEMES['lume'].products;
        this.products.set(themeProds);
        localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(themeProds));
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
      backgroundColor: config.backgroundColor
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
      this.categories.set(theme.categories);
      this.products.set(theme.products);
      if (this.isBrowser()) {
        localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(theme.categories));
        localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(theme.products));
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
    this.categories.set(defaultTheme.categories);
    this.products.set(defaultTheme.products);
    this.orders.set(DEFAULT_ORDERS);
    this.customers.set(DEFAULT_CUSTOMERS);

    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_THEME_ID, 'lume');
      localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(defaultTheme.categories));
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(defaultTheme.products));
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
}
