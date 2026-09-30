import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { SeoService } from '../../../../core/services/seo.service';
import { DemoStorageService } from '../../../../core/services/demo-storage.service';
import { EmailPreviewComponent } from '../../../../shared/components/email-preview/email-preview.component';

@Component({
  selector: 'app-order-confirmation-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, EmailPreviewComponent],
  templateUrl: './order-confirmation-page.component.html',
  styleUrls: ['./order-confirmation-page.component.scss'],
})
export class OrderConfirmationPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private checkoutService = inject(CheckoutService);
  private seoService = inject(SeoService);
  private demoStorage = inject(DemoStorageService);

  get storeConfig() {
    return this.demoStorage.activeConfig();
  }

  orderId = signal<string>('');
  order = signal<any>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  codeCopied = signal<boolean>(false);
  showEmailPreview = signal<boolean>(false);

  ngOnInit(): void {
    this.seoService.setPageMeta(
      'Pedido Confirmado com Sucesso',
      `Obrigado por comprar na ${this.storeConfig.name}. Seu pedido foi confirmado com sucesso.`
    );

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderId.set(id);
      this.loadOrder(id);
    } else {
      this.isLoading.set(false);
      this.errorMessage.set('Identificador do pedido não encontrado.');
    }
  }

  loadOrder(id: string) {
    this.checkoutService.getOrderDetails(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Não foi possível carregar os detalhes do pedido.');
      },
    });
  }

  getOrderStep(): number {
    const status = this.order()?.status;
    switch (status) {
      case 'DELIVERED':
        return 5;
      case 'SHIPPED':
        return 4;
      case 'PREPARING':
        return 3;
      case 'PAID':
        return 2;
      case 'PENDING_PAYMENT':
      default:
        return 1;
    }
  }

  getCorreiosTrackingUrl(code: string): string {
    const cleanCode = encodeURIComponent((code || '').trim());
    return `https://rastreamento.correios.com.br/app/index.php?codigo=${cleanCode}`;
  }

  copyTrackingCode(code: string): void {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      this.codeCopied.set(true);
      setTimeout(() => this.codeCopied.set(false), 2500);
    });
  }

  getWhatsAppSupportUrl(): string {
    const num = this.order()?.orderNumber || this.orderId();
    const phone = this.storeConfig.whatsappNumber || '5511999999999';
    const text = encodeURIComponent(
      `Olá! Gostaria de informações sobre o meu pedido #${num} realizado na ${this.storeConfig.name}.`
    );
    return `https://wa.me/${phone}?text=${text}`;
  }
}
