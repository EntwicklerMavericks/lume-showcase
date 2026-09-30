import { Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoStorageService } from '../../../core/services/demo-storage.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type EmailType = 'order_created' | 'payment_confirmed' | 'order_shipped' | 'order_delivered';

@Component({
  selector: 'app-email-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss'],
})
export class EmailPreviewComponent {
  private demoStorage = inject(DemoStorageService);
  private sanitizer = inject(DomSanitizer);

  /** Dados do pedido para preenchimento dinâmico */
  orderData = input<any>(null);

  /** Evento emitido ao fechar o preview */
  close = output<void>();

  /** Tipo de e-mail ativo na aba */
  activeTab = signal<EmailType>('order_created');

  /** Modo de visualização: desktop ou mobile */
  viewport = signal<'desktop' | 'mobile'>('desktop');

  get storeConfig() {
    return this.demoStorage.activeConfig();
  }

  /** Renderiza o HTML seguro para o e-mail selecionado */
  renderedHtml = computed<SafeHtml>(() => {
    const tab = this.activeTab();
    const config = this.storeConfig;
    const order = this.orderData() || {
      orderNumber: '1025',
      customerName: 'Eduardo Theodoro',
      customerEmail: 'eduardo@exemplo.com',
      total: 299.80,
      subtotal: 269.90,
      shippingCost: 29.90,
      shippingMethod: 'Correios SEDEX',
      paymentMethod: 'PIX',
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Apto 42',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01310-100',
      trackingCode: 'BR847291039SL',
      items: [
        { name: 'Camiseta Performance Dry-Fit', size: 'M', color: 'Azul', quantity: 2, price: 119.90, total: 239.80 },
        { name: 'Meia Esportiva Alta Compressão', size: 'U', color: 'Preto', quantity: 1, price: 30.10, total: 30.10 }
      ]
    };

    let bodyContent = '';
    let title = '';
    let subtitle = '';

    const formatBrl = (val: number) =>
      Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (tab === 'order_created') {
      title = 'Pedido Realizado com Sucesso!';
      subtitle = `Olá, ${order.customerName?.split(' ')[0] || 'Cliente'}! Recebemos seu pedido #${order.orderNumber} e estamos aguardando a confirmação do pagamento.`;

      const itemsRows = (order.items || []).map((i: any) => `
        <tr style="border-bottom: 1px solid #1E293B;">
          <td style="padding: 12px 0; color: #F8FAFC; font-size: 14px;">
            <strong>${i.name}</strong><br>
            <span style="color: #94A3B8; font-size: 12px;">Qtd: ${i.quantity} ${i.size ? `• Tam: ${i.size}` : ''} ${i.color ? `• Cor: ${i.color}` : ''}</span>
          </td>
          <td style="padding: 12px 0; text-align: right; color: #F8FAFC; font-size: 14px; font-weight: 600;">
            ${formatBrl(i.total || (i.price * i.quantity))}
          </td>
        </tr>
      `).join('');

      bodyContent = `
        <div style="background-color: #0F172A; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #CCA45E; margin: 0 0 10px 0; font-size: 16px;">Detalhes do Pedido #${order.orderNumber}</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            ${itemsRows}
          </table>
          <table style="width: 100%; font-size: 14px; color: #CBD5E1; border-top: 1px solid #334155; padding-top: 10px;">
            <tr>
              <td style="padding: 4px 0;">Subtotal:</td>
              <td style="text-align: right; color: #F8FAFC;">${formatBrl(order.subtotal || order.total)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;">Frete (${order.shippingMethod || 'Correios'}):</td>
              <td style="text-align: right; color: #F8FAFC;">${order.shippingCost === 0 ? '<strong style="color: #4ADE80;">Grátis</strong>' : formatBrl(order.shippingCost)}</td>
            </tr>
            <tr style="font-size: 16px; font-weight: bold; border-top: 1px solid #334155;">
              <td style="padding: 10px 0 0 0; color: #F8FAFC;">Total:</td>
              <td style="padding: 10px 0 0 0; text-align: right; color: #CCA45E;">${formatBrl(order.total)}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #080D1A; border-left: 4px solid #CCA45E; border-radius: 6px; padding: 14px; margin: 20px 0;">
          <h4 style="color: #F8FAFC; margin: 0 0 4px 0; font-size: 14px;">Endereço de Entrega:</h4>
          <p style="color: #94A3B8; font-size: 13px; margin: 0; line-height: 1.5;">
            ${order.street}, ${order.number} ${order.complement ? `• ${order.complement}` : ''}<br>
            ${order.neighborhood} — ${order.city}/${order.state} • CEP: ${order.postalCode}
          </p>
        </div>
      `;
    } else if (tab === 'payment_confirmed') {
      title = 'Pagamento Aprovado! 🎉';
      subtitle = `Olá, ${order.customerName?.split(' ')[0] || 'Cliente'}! Confirmamos seu pagamento de ${formatBrl(order.total)}.`;

      bodyContent = `
        <div style="background-color: #0F172A; border-left: 4px solid #4ADE80; border-radius: 8px; padding: 22px; margin: 20px 0;">
          <h3 style="color: #4ADE80; margin: 0 0 8px 0; font-size: 16px;">Seu pedido #${order.orderNumber} entrou em preparação!</h3>
          <p style="color: #CBD5E1; margin: 0 0 12px 0; font-size: 14px; line-height: 1.6;">
            Nossa equipe já está separando, revisando e embalando seus produtos com toda a dedicação.
          </p>
          <p style="color: #94A3B8; margin: 0; font-size: 13px;">
            Assim que a etiqueta dos Correios for emitida e o pacote despachado, você receberá um e-mail com o código de rastreamento.
          </p>
        </div>

        <div style="text-align: center; margin: 25px 0;">
          <span style="display: inline-block; background-color: #1E293B; color: #CBD5E1; padding: 8px 16px; border-radius: 999px; font-size: 13px;">
            Método: <strong style="color: #CCA45E;">${order.paymentMethod === 'PIX' ? '⚡ PIX Instantâneo' : '💳 Cartão de Crédito'}</strong>
          </span>
        </div>
      `;
    } else if (tab === 'order_shipped') {
      title = 'Seu pedido está a caminho! 📦';
      subtitle = `Olá, ${order.customerName?.split(' ')[0] || 'Cliente'}! Seu pedido #${order.orderNumber} acabou de ser postado.`;

      const tracking = order.trackingCode || 'BR928172635SL';

      bodyContent = `
        <div style="background-color: #0F172A; border: 1px solid #334155; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
          <p style="color: #CBD5E1; font-size: 14px; margin: 0 0 8px 0;">Transportadora / Envio: <strong style="color: #F8FAFC;">${order.shippingMethod || 'Correios'}</strong></p>
          <div style="background-color: #080D1A; border: 1px dashed #CCA45E; border-radius: 8px; padding: 15px; margin: 15px auto; max-width: 320px;">
            <span style="color: #94A3B8; font-size: 12px; display: block; margin-bottom: 4px;">Código de Rastreamento Correios:</span>
            <span style="color: #CCA45E; font-size: 20px; font-weight: bold; letter-spacing: 2px; font-family: monospace;">${tracking}</span>
          </div>
          <a href="https://rastreamento.correios.com.br/app/index.php?codigo=${tracking}" target="_blank" style="display: inline-block; background-color: #CCA45E; color: #0A152E; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; margin-top: 10px;">
            Rastrear Encomenda nos Correios ↗
          </a>
        </div>
      `;
    } else if (tab === 'order_delivered') {
      title = 'Pedido Entregue! ✨';
      subtitle = `Olá, ${order.customerName?.split(' ')[0] || 'Cliente'}! Os Correios confirmaram a entrega do pedido #${order.orderNumber}.`;

      bodyContent = `
        <div style="background-color: #0F172A; border: 1px solid #4ADE80; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
          <div style="font-size: 40px; margin-bottom: 10px;">🎁</div>
          <h3 style="color: #F8FAFC; margin: 0 0 8px 0; font-size: 18px;">Esperamos que você ame cada detalhe!</h3>
          <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            A sua satisfação é a nossa maior prioridade. Se precisar trocar algum tamanho ou falar com nosso consultor, estamos sempre à disposição.
          </p>
          <a href="https://wa.me/${config.whatsappNumber}?text=Ol%C3%A1!%20Recebi%20meu%20pedido%20%23${order.orderNumber}%20da%20${encodeURIComponent(config.name)}!" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px;">
            Avaliar Atendimento no WhatsApp
          </a>
        </div>
      `;
    }

    const fullTemplate = `
      <div style="background-color: #050B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px 12px; min-height: 100%; box-sizing: border-box;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0A152E; border: 1px solid #1E293B; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 28px 24px; text-align: center; border-bottom: 2px solid #CCA45E; background-color: #070E1F;">
              <h1 style="color: #CCA45E; font-size: 22px; font-weight: 800; letter-spacing: 2px; margin: 0; text-transform: uppercase;">
                ${config.name}
              </h1>
              <p style="color: #94A3B8; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">
                ${config.tagline || 'E-commerce Oficial'}
              </p>
            </td>
          </tr>

          <!-- Hero Body -->
          <tr>
            <td style="padding: 30px 24px;">
              <h2 style="color: #F8FAFC; font-size: 20px; font-weight: 700; margin: 0 0 8px 0; text-align: center;">
                ${title}
              </h2>
              <p style="color: #94A3B8; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0; text-align: center;">
                ${subtitle}
              </p>

              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center; background-color: #060D1C; border-top: 1px solid #1E293B;">
              <p style="color: #94A3B8; font-size: 12px; margin: 0 0 8px 0;">
                Dúvidas sobre seu pedido? Entre em contato pelo WhatsApp: <strong style="color: #F8FAFC;">${config.whatsappFormatted || config.whatsappNumber}</strong>
              </p>
              <p style="color: #64748B; font-size: 11px; margin: 0;">
                © 2026 ${config.name}. Todos os direitos reservados. E-mail automático transacional.
              </p>
            </td>
          </tr>
        </table>
      </div>
    `;

    return this.sanitizer.bypassSecurityTrustHtml(fullTemplate);
  });

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('email-modal-backdrop')) {
      this.close.emit();
    }
  }

  selectTab(tab: EmailType) {
    this.activeTab.set(tab);
    setTimeout(() => {
      const el = document.querySelector('.email-preview-scroll-wrapper');
      if (el) el.scrollTop = 0;
    }, 10);
  }

  setViewport(vp: 'desktop' | 'mobile') {
    this.viewport.set(vp);
    setTimeout(() => {
      const el = document.querySelector('.email-preview-scroll-wrapper');
      if (el) el.scrollTop = 0;
    }, 10);
  }
}
