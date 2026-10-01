import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../../core/services/cart.service';
import { WhatsappService } from '../../../../core/services/whatsapp.service';
import { SeoService } from '../../../../core/services/seo.service';
import { CartItem, ShippingOption } from '../../../../core/models/store.models';
import { DemoStorageService } from '../../../../core/services/demo-storage.service';
import { ShippingService } from '../../../../core/services/shipping.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private whatsappService = inject(WhatsappService);
  private seoService = inject(SeoService);
  private demoStorage = inject(DemoStorageService);
  private router = inject(Router);
  shippingService = inject(ShippingService);

  get storeConfig() {
    return this.demoStorage.activeConfig();
  }

  cartItems = this.cartService.cartItems;
  subtotal = this.cartService.subtotal;
  totalItems = this.cartService.totalItems;
  isEmpty = this.cartService.isEmpty;

  // Frete
  selectedShipping = this.shippingService.selectedOption;
  shippingResult = this.shippingService.lastResult;
  isCalculatingShipping = this.shippingService.isCalculating;
  shippingCost = computed(() => this.shippingService.shippingCost());
  total = computed(() => Math.round((this.subtotal() + this.shippingCost()) * 100) / 100);

  shippingCep = signal('');
  customerNote = signal('');

  ngOnInit(): void {
    this.seoService.setPageMeta(
      'Sacola de Compras',
      `Confira os itens selecionados na sua sacola de compras da ${this.storeConfig.name} e finalize com frete calculado para todo o Brasil.`
    );

    const existingCep = this.shippingService.currentCep();
    if (existingCep && existingCep.length === 8) {
      this.shippingCep.set(`${existingCep.slice(0, 5)}-${existingCep.slice(5)}`);
    }
  }

  updateQuantity(item: CartItem, quantity: number) {
    this.cartService.updateQuantity(item.product.id, quantity, item.size, item.color);
    // Recalcula frete se houver regra de frete grátis
    const clean = this.shippingCep().replace(/\D/g, '');
    if (clean.length === 8) {
      this.shippingService.calculate(clean, this.subtotal()).subscribe({ error: () => {} });
    }
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.product.id, item.size, item.color);
    const clean = this.shippingCep().replace(/\D/g, '');
    if (clean.length === 8) {
      this.shippingService.calculate(clean, this.subtotal()).subscribe({ error: () => {} });
    }
  }

  clearCart() {
    this.cartService.clearCart();
    this.shippingService.clearShipping();
  }

  onCepInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    this.shippingCep.set(v);

    const clean = v.replace(/\D/g, '');
    if (clean.length === 8) {
      this.calculateShipping();
    }
  }

  calculateShipping() {
    const clean = this.shippingCep().replace(/\D/g, '');
    if (clean.length === 8) {
      this.shippingService.calculate(clean, this.subtotal()).subscribe({ error: () => {} });
    }
  }

  selectShipping(option: ShippingOption) {
    this.shippingService.selectOption(option);
  }

  goToCheckout() {
    if (this.isEmpty()) return;
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/conta/login'], { queryParams: { returnUrl: '/checkout' } });
    }
  }

  checkoutViaWhatsApp() {
    if (this.isEmpty()) return;
    this.whatsappService.sendCartOrder(this.cartItems(), this.total(), this.customerNote());
  }

  getItemPrice(item: CartItem): number {
    return item.product.promotionalPrice ?? item.product.price;
  }

  getItemTotal(item: CartItem): number {
    return this.getItemPrice(item) * item.quantity;
  }
}
