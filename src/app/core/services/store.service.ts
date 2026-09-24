import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, Category } from '../models/store.models';
import { DemoStorageService } from './demo-storage.service';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly demoStorage = inject(DemoStorageService);

  readonly isLoading = signal<boolean>(false);
  readonly hasError = signal<boolean>(false);
  readonly isUsingCache = signal<boolean>(false);

  /** Todos os produtos ativos */
  readonly products = computed(() =>
    this.demoStorage.products().filter((p) => p.available)
  );

  /** Todas as categorias */
  readonly categories = this.demoStorage.categories;

  /** Produtos em destaque */
  readonly featuredProducts = computed(() =>
    this.demoStorage.products().filter((p) => p.featured && p.available)
  );

  /** Produtos novos */
  readonly newProducts = computed(() =>
    this.demoStorage.products().filter((p) => p.isNew && p.available)
  );

  loadData(): void {
    // Modo zero-backend: os dados já estão no DemoStorageService sincronizados com LocalStorage
    this.isLoading.set(false);
    this.hasError.set(false);
  }

  /** Buscar produto por ID ou Slug com suporte a Observable */
  getProduct(idOrSlug: string): Observable<Product | undefined> {
    const found = this.getProductById(idOrSlug) || this.getProductBySlug(idOrSlug);
    return of(found);
  }

  /** Buscar produto por ID no estado atual */
  getProductById(id: string): Product | undefined {
    return this.demoStorage.getProductById(id);
  }

  /** Buscar produto por slug no estado atual */
  getProductBySlug(slug: string): Product | undefined {
    return this.demoStorage.getProductBySlug(slug);
  }

  /** Buscar categoria por ID no estado atual */
  getCategoryById(id: string): Category | undefined {
    return this.demoStorage.categories().find((c) => c.id === id);
  }

  /** Buscar categoria por slug no estado atual */
  getCategoryBySlug(slug: string): Category | undefined {
    return this.demoStorage.categories().find((c) => c.slug === slug);
  }

  /** Produtos por categoria */
  getProductsByCategory(categoryId: string): Product[] {
    return this.demoStorage.products().filter(
      (p) => p.categoryId === categoryId && p.available
    );
  }

  /** Buscar produtos por termo */
  searchProducts(query: string): Product[] {
    const term = query.toLowerCase().trim();
    if (!term) return this.demoStorage.products().filter((p) => p.available);

    return this.demoStorage.products().filter(
      (p) =>
        p.available &&
        (p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          (p.sku && p.sku.toLowerCase().includes(term)))
    );
  }

  /** Filtrar produtos */
  filterProducts(filters: {
    categoryId?: string;
    size?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    query?: string;
    sort?: 'newest' | 'price-asc' | 'price-desc';
  }): Product[] {
    let result = this.demoStorage.products().filter((p) => p.available);

    if (filters.categoryId) {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters.size) {
      result = result.filter((p) => p.sizes?.includes(filters.size!));
    }

    if (filters.color) {
      result = result.filter((p) =>
        p.colors?.some((c) => c.name === filters.color)
      );
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(
        (p) => (p.promotionalPrice ?? p.price) >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(
        (p) => (p.promotionalPrice ?? p.price) <= filters.maxPrice!
      );
    }

    if (filters.query) {
      const term = filters.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          (p.sku && p.sku.toLowerCase().includes(term))
      );
    }

    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          result.sort(
            (a, b) =>
              (a.promotionalPrice ?? a.price) - (b.promotionalPrice ?? b.price)
          );
          break;
        case 'price-desc':
          result.sort(
            (a, b) =>
              (b.promotionalPrice ?? b.price) - (a.promotionalPrice ?? a.price)
          );
          break;
        case 'newest':
          result.sort(
            (a, b) =>
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime()
          );
          break;
      }
    }

    return result;
  }
}
