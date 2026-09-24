import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem, Product } from '../models/store.models';
import { DemoStorageService } from './demo-storage.service';

/**
 * Serviço de integração com WhatsApp para o Modo Demonstração.
 * Usa as configurações ativas do DemoStorageService em tempo real.
 */
@Injectable({
  providedIn: 'root',
})
export class WhatsappService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly demoStorage = inject(DemoStorageService);

  /**
   * Gera mensagem formatada para um pedido completo (carrinho).
   */
  buildCartMessage(items: CartItem[], total: number, customerNote?: string): string {
    const config = this.demoStorage.activeConfig();
    const greeting = `Olá! Gostaria de fazer um pedido na ${config.name}.`;
    const lines: string[] = [greeting, '', '🛍️ *Produtos selecionados:*', ''];

    items.forEach((item) => {
      const price = item.product.promotionalPrice ?? item.product.price;
      const itemTotal = price * item.quantity;

      let line = `• ${item.quantity}x ${item.product.name}`;
      if (item.size) line += ` | Tam: ${item.size}`;
      if (item.color) line += ` | Cor: ${item.color}`;
      line += `\n  ${this.formatPrice(itemTotal)}`;

      lines.push(line);
    });

    lines.push('', `*Total do Pedido: ${this.formatPrice(total)}*`);

    if (customerNote && customerNote.trim()) {
      lines.push('', `📝 Observação: ${customerNote.trim()}`);
    }

    lines.push('', 'Gostaria de combinar a entrega e a forma de pagamento!');

    return lines.join('\n');
  }

  /**
   * Gera mensagem para compra direta de um produto.
   */
  buildProductMessage(
    product: Product,
    quantity: number = 1,
    size?: string,
    color?: string
  ): string {
    const config = this.demoStorage.activeConfig();
    const price = product.promotionalPrice ?? product.price;
    const total = price * quantity;

    const lines: string[] = [
      `Olá! Vim pelo catálogo da ${config.name} e gostaria de pedir:`,
      '',
      `✨ *${product.name}*`,
    ];

    if (size) lines.push(`Tamanho: ${size}`);
    if (color) lines.push(`Cor: ${color}`);
    lines.push(`Quantidade: ${quantity}`);
    lines.push(`Total: ${this.formatPrice(total)}`);
    lines.push('', 'Como podemos prosseguir com o pagamento e entrega?');

    return lines.join('\n');
  }

  /**
   * Abre o WhatsApp com a mensagem formatada direcionada ao número ativo.
   */
  openWhatsApp(message: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const config = this.demoStorage.activeConfig();
    const cleanNumber = (config.whatsappNumber || '5511963041542').replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }

  /**
   * Atalho: abre WhatsApp com carrinho completo.
   */
  sendCartOrder(items: CartItem[], total: number, customerNote?: string): void {
    const message = this.buildCartMessage(items, total, customerNote);
    this.openWhatsApp(message);
  }

  /**
   * Atalho: abre WhatsApp para compra direta de um produto.
   */
  sendProductOrder(
    product: Product,
    quantity?: number,
    size?: string,
    color?: string
  ): void {
    const message = this.buildProductMessage(product, quantity, size, color);
    this.openWhatsApp(message);
  }

  /** Formata valor em BRL */
  private formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
