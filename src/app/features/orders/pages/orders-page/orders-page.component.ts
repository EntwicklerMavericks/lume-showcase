import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoStorageService, DemoOrder } from '../../../../core/services/demo-storage.service';

export interface StatusOption {
  value: string;
  label: string;
}

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

  /** ID do pedido cujo dropdown customizado de status está aberto */
  openDropdownOrderId = signal<string | null>(null);

  /** Opções padronizadas de status de pedido */
  readonly statusOptions: StatusOption[] = [
    { value: 'pending', label: 'Aguardando Pagamento' },
    { value: 'paid', label: 'Pago' },
    { value: 'preparing', label: 'Em separação' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

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

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.openDropdownOrderId()) {
      this.openDropdownOrderId.set(null);
    }
  }

  toggleStatusDropdown(orderId: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.openDropdownOrderId() === orderId) {
      this.openDropdownOrderId.set(null);
    } else {
      this.openDropdownOrderId.set(orderId);
    }
  }

  selectStatus(orderId: string, status: any, event: MouseEvent): void {
    event.stopPropagation();
    this.demoStorage.updateOrderStatus(orderId, status);
    this.openDropdownOrderId.set(null);

    const currentSelected = this.selectedOrder();
    if (currentSelected && (currentSelected.id === orderId || currentSelected.orderNumber === orderId)) {
      const updated = this.demoStorage.getOrderById(orderId);
      if (updated) {
        this.selectedOrder.set(updated);
        this.trackingInput.set(updated.trackingCode || '');
      }
    }
  }

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
}
