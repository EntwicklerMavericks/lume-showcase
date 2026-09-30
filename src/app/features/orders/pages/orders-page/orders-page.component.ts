import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoStorageService, DemoOrder } from '../../../../core/services/demo-storage.service';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss'
})
export class OrdersPageComponent {
  private demoStorage = inject(DemoStorageService);

  showDetailsModal = signal<boolean>(false);
  selectedOrder = signal<DemoOrder | null>(null);
  searchQuery = signal<string>('');

  trackingInput = signal<string>('');
  isSavingTracking = signal<boolean>(false);
  saveTrackingSuccess = signal<boolean>(false);

  /**
   * Lista reativa de pedidos conectada diretamente ao DemoStorageService,
   * incluindo novos pedidos criados no checkout da loja e filtro em tempo real.
   */
  orders = computed<DemoOrder[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const list = this.demoStorage.orders();
    if (!query) return list;

    return list.filter(ord =>
      (ord.orderNumber && ord.orderNumber.toLowerCase().includes(query)) ||
      (ord.id && ord.id.toLowerCase().includes(query)) ||
      (ord.client && ord.client.toLowerCase().includes(query)) ||
      (ord.email && ord.email.toLowerCase().includes(query)) ||
      (ord.statusLabel && ord.statusLabel.toLowerCase().includes(query)) ||
      (ord.trackingCode && ord.trackingCode.toLowerCase().includes(query))
    );
  });

  openDetails(order: DemoOrder): void {
    this.selectedOrder.set(order);
    this.trackingInput.set(order.trackingCode || '');
    this.saveTrackingSuccess.set(false);
    this.showDetailsModal.set(true);
  }

  closeModal(): void {
    this.showDetailsModal.set(false);
    this.selectedOrder.set(null);
  }

  onTrackingInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.trackingInput.set(val);
  }

  saveTracking(order: DemoOrder): void {
    const code = this.trackingInput().trim().toUpperCase();
    this.isSavingTracking.set(true);
    this.saveTrackingSuccess.set(false);

    setTimeout(() => {
      this.demoStorage.saveOrderTracking(order.id, code);
      this.isSavingTracking.set(false);
      this.saveTrackingSuccess.set(true);

      const updated = this.demoStorage.getOrderById(order.id);
      if (updated) {
        this.selectedOrder.set(updated);
      }

      setTimeout(() => this.saveTrackingSuccess.set(false), 3000);
    }, 200);
  }

  getCorreiosUrl(code?: string): string {
    if (!code) return 'https://rastreamento.correios.com.br';
    return `https://rastreamento.correios.com.br/app/index.php?codigo=${encodeURIComponent(code.trim())}`;
  }

  updateStatus(orderId: string, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as any;
    this.demoStorage.updateOrderStatus(orderId, newStatus);

    const currentSelected = this.selectedOrder();
    if (currentSelected && (currentSelected.id === orderId || currentSelected.orderNumber === orderId)) {
      const updated = this.demoStorage.getOrderById(orderId);
      if (updated) {
        this.selectedOrder.set(updated);
        this.trackingInput.set(updated.trackingCode || '');
      }
    }
  }
}
