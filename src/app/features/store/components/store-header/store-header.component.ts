import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DemoStorageService } from '../../../../core/services/demo-storage.service';
import { StoreService } from '../../../../core/services/store.service';

@Component({
  selector: 'app-store-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './store-header.component.html',
  styleUrls: ['./store-header.component.scss']
})
export class StoreHeaderComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  private storeService = inject(StoreService);
  private demoStorage = inject(DemoStorageService);

  categories = this.storeService.categories;
  isMobileMenuOpen = signal(false);

  get storeConfig() {
    return this.demoStorage.activeConfig();
  }

  get whatsappLink(): string {
    const c = this.demoStorage.activeConfig();
    return `https://wa.me/${c.whatsappNumber}?text=${encodeURIComponent(`Olá! Vim pelo site da ${c.name} e gostaria de falar com um consultor.`)}`;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
