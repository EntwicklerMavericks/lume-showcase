import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DemoStorageService } from './demo-storage.service';
import { Product } from '../models/store.models';

export interface AdminProductImage {
  id?: string;
  url: string;
  isMain: boolean;
  order?: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug?: string;
  sku: string;
  description: string;
  price: number;
  promotionalPrice?: number | null;
  pricePromo?: number | null;
  stock: number;
  status: boolean;
  sizes: string[];
  colors: any[];
  gender: string;
  highlight: boolean;
  newLaunch: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  composition?: string;
  fit?: string;
  washCare?: string;
  images: AdminProductImage[];
  createdAt: string;
  updatedAt?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: {
    products: number;
  };
}

function mapProductToAdminProduct(p: Product): AdminProduct {
  const images: AdminProductImage[] = (p.images || []).map((url, idx) => ({
    id: `img-${idx}`,
    url,
    isMain: idx === 0,
    order: idx
  }));

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku || 'SKU-' + p.id.slice(-4),
    description: p.description || '',
    price: p.price,
    promotionalPrice: p.promotionalPrice || null,
    pricePromo: p.promotionalPrice || null,
    stock: 25,
    status: p.available,
    sizes: p.sizes || [],
    colors: p.colors || [],
    gender: 'Unissex',
    highlight: Boolean(p.featured),
    newLaunch: p.isNew || false,
    categoryId: p.categoryId,
    category: p.category ? {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug
    } : undefined,
    composition: p.composition,
    fit: p.fit,
    washCare: p.washCare,
    images,
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

@Injectable({
  providedIn: 'root',
})
export class AdminProductsService {
  private readonly demoStorage = inject(DemoStorageService);

  /**
   * Listar todos os produtos (incluindo inativos para o admin)
   */
  getProducts(all: boolean = true): Observable<AdminProduct[]> {
    const list = this.demoStorage.products();
    const adminList = (all ? list : list.filter((p) => p.available)).map(mapProductToAdminProduct);
    return of(adminList);
  }

  /**
   * Obter produto por ID
   */
  getProductById(id: string): Observable<AdminProduct> {
    const p = this.demoStorage.getProductById(id);
    if (!p) {
      throw new Error(`Produto não encontrado com id ${id}`);
    }
    return of(mapProductToAdminProduct(p));
  }

  /**
   * Criar novo produto
   */
  createProduct(productData: Partial<AdminProduct>): Observable<AdminProduct> {
    const created = this.demoStorage.createProduct(productData);
    return of(mapProductToAdminProduct(created));
  }

  /**
   * Atualizar produto existente
   */
  updateProduct(id: string, productData: Partial<AdminProduct>): Observable<AdminProduct> {
    const updated = this.demoStorage.updateProduct(id, productData);
    return of(mapProductToAdminProduct(updated));
  }

  /**
   * Alternar status ativo/inativo do produto
   */
  toggleProductStatus(id: string): Observable<AdminProduct> {
    const toggled = this.demoStorage.toggleProductStatus(id);
    return of(mapProductToAdminProduct(toggled));
  }

  /**
   * Excluir produto
   */
  deleteProduct(id: string): Observable<{ message: string }> {
    this.demoStorage.deleteProduct(id);
    return of({ message: 'Produto excluído com sucesso!' });
  }

  /**
   * Listar todas as categorias com contagem de produtos
   */
  getCategories(): Observable<AdminCategory[]> {
    const categories = this.demoStorage.categories();
    const products = this.demoStorage.products();

    const adminCats: AdminCategory[] = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      _count: {
        products: products.filter((p) => p.categoryId === cat.id).length
      }
    }));

    return of(adminCats);
  }

  /**
   * Criar nova categoria
   */
  createCategory(categoryData: Partial<AdminCategory>): Observable<AdminCategory> {
    const created = this.demoStorage.createCategory(categoryData);
    return of({
      id: created.id,
      name: created.name,
      slug: created.slug,
      description: created.description,
      image: created.image,
      _count: { products: 0 }
    });
  }

  /**
   * Atualizar categoria existente
   */
  updateCategory(id: string, categoryData: Partial<AdminCategory>): Observable<AdminCategory> {
    const updated = this.demoStorage.updateCategory(id, categoryData);
    const count = this.demoStorage.products().filter((p) => p.categoryId === id).length;
    return of({
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      description: updated.description,
      image: updated.image,
      _count: { products: count }
    });
  }

  /**
   * Excluir categoria
   */
  deleteCategory(id: string): Observable<{ message: string }> {
    this.demoStorage.deleteCategory(id);
    return of({ message: 'Categoria excluída com sucesso!' });
  }
}
