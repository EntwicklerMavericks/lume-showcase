import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoStorageService } from '../../../../core/services/demo-storage.service';
import { StoreService } from '../../../../core/services/store.service';

@Component({
  selector: 'app-store-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './store-footer.component.html',
  styleUrls: ['./store-footer.component.scss']
})
export class StoreFooterComponent {
  private storeService = inject(StoreService);
  private demoStorage = inject(DemoStorageService);

  categories = this.storeService.categories;
  currentYear = new Date().getFullYear();

  get storeConfig() {
    return this.demoStorage.activeConfig();
  }

  get storeName(): string {
    return this.demoStorage.activeConfig().name;
  }

  get whatsappLink(): string {
    const c = this.demoStorage.activeConfig();
    return `https://wa.me/${c.whatsappNumber}?text=${encodeURIComponent(`Olá! Vim pelo site da ${c.name} e gostaria de falar com um atendente sobre o catálogo e pedidos.`)}`;
  }
}

