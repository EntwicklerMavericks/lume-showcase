import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../../../core/services/store.service';
import { DemoStorageService } from '../../../../core/services/demo-storage.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  private storeService = inject(StoreService);
  private demoStorage = inject(DemoStorageService);
  private seoService = inject(SeoService);

  featuredProducts = this.storeService.featuredProducts;
  categories = this.storeService.categories;
  newProducts = this.storeService.newProducts;

  get storeConfig() {
    return this.demoStorage.activeConfig();
  }

  get storeName(): string {
    return this.demoStorage.activeConfig().name;
  }

  get whatsappLink(): string {
    const c = this.demoStorage.activeConfig();
    return `https://wa.me/${c.whatsappNumber}?text=${encodeURIComponent(`Olá! Vim pelo site da ${c.name} e gostaria de conhecer os lançamentos.`)}`;
  }

  get whatsappSizingLink(): string {
    const c = this.demoStorage.activeConfig();
    return `https://wa.me/${c.whatsappNumber}?text=${encodeURIComponent(`Olá! Vim pelo site da ${c.name} e gostaria de tirar dúvidas sobre o tamanho e caimento das peças.`)}`;
  }

  ngOnInit(): void {
    const c = this.demoStorage.activeConfig();
    this.seoService.setPageMeta(
      `${c.name} — ${c.tagline}`,
      `${c.name} — ${c.description}`
    );
  }
}
