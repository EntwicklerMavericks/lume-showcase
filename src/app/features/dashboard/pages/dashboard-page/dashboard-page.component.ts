import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { DemoStorageService } from '../../../../core/services/demo-storage.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  standalone: true,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private authService = inject(AuthService);
  private demoStorage = inject(DemoStorageService);

  currentUser = this.authService.currentUser;

  get stats() {
    const prods = this.demoStorage.products().length;
    const orders = this.demoStorage.orders().length;
    const clients = this.demoStorage.customers().length;

    return [
      { title: 'Total de Produtos', value: prods.toString(), icon: 'products' },
      { title: 'Total de Pedidos', value: (120 + orders).toString(), icon: 'orders' },
      { title: 'Total de Clientes', value: (85 + clients).toString(), icon: 'clients' }
    ];
  }

  get latestProducts() {
    return this.demoStorage.products().slice(0, 3).map((p) => ({
      name: p.name,
      sku: p.sku || 'SKU-' + p.id.slice(-4),
      price: p.promotionalPrice || p.price,
      image: p.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200'
    }));
  }

  get latestOrders() {
    return this.demoStorage.orders();
  }
}
