import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, catchError } from 'rxjs';
import {
  CheckoutPayload,
  CheckoutResponse,
  OrderStatusResponse,
  ViaCepResult,
} from '../models/store.models';
import { DemoStorageService, DemoOrder } from './demo-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private http = inject(HttpClient);
  private demoStorage = inject(DemoStorageService);

  /**
   * Consulta dados de um CEP via ViaCEP
   */
  lookupCep(cep: string): Observable<ViaCepResult> {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) {
      return of({
        cep,
        logradouro: '',
        complemento: '',
        bairro: '',
        localidade: '',
        uf: '',
        erro: true,
      });
    }

    return this.http.get<ViaCepResult>(`https://viacep.com.br/ws/${clean}/json/`).pipe(
      catchError(() =>
        of({
          cep,
          logradouro: '',
          complemento: '',
          bairro: '',
          localidade: '',
          uf: '',
          erro: true,
        })
      )
    );
  }

  /**
   * Processa o checkout no modo demonstração client-side.
   * Cria o pedido, salva no DemoStorage e gera dados de PIX ou cartão aprovado.
   */
  processCheckout(payload: CheckoutPayload): Observable<CheckoutResponse> {
    const orderNum = Math.floor(1025 + Math.random() * 8900).toString();
    const orderId = 'ord-' + Date.now().toString(36);
    const subtotal = payload.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingCost = Number(payload.shippingCost) || 0;
    const total = Math.round((subtotal + shippingCost) * 100) / 100;

    const now = new Date();
    const formattedDate = `Hoje, ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    let pixData: { qrCodeImage: string; copiaECola: string; expiresAt: string } | undefined = undefined;

    if (payload.paymentMethod === 'PIX') {
      const cleanCpf = payload.customerCpf.replace(/\D/g, '');
      const copiaECola = `00020126580014br.gov.bcb.pix0136${orderId}-lume-store520400005303986540${total.toFixed(2)}5802BR5925${encodeURIComponent(payload.customerName.slice(0, 25))}6009SAO PAULO62070503***6304D1B8`;
      
      // QR Code SVG realista para exibição sem dependências externas
      const qrSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" fill="#ffffff" rx="8"/>
        <!-- Corners -->
        <rect x="20" y="20" width="45" height="45" fill="#000000" rx="4"/>
        <rect x="25" y="25" width="35" height="35" fill="#ffffff" rx="2"/>
        <rect x="32" y="32" width="21" height="21" fill="#000000" rx="2"/>

        <rect x="135" y="20" width="45" height="45" fill="#000000" rx="4"/>
        <rect x="140" y="25" width="35" height="35" fill="#ffffff" rx="2"/>
        <rect x="147" y="32" width="21" height="21" fill="#000000" rx="2"/>

        <rect x="20" y="135" width="45" height="45" fill="#000000" rx="4"/>
        <rect x="25" y="140" width="35" height="35" fill="#ffffff" rx="2"/>
        <rect x="32" y="147" width="21" height="21" fill="#000000" rx="2"/>

        <!-- Pattern Mock -->
        <rect x="75" y="25" width="10" height="20" fill="#000000"/>
        <rect x="95" y="20" width="15" height="10" fill="#000000"/>
        <rect x="115" y="35" width="10" height="15" fill="#000000"/>
        <rect x="75" y="55" width="25" height="10" fill="#000000"/>
        <rect x="110" y="55" width="15" height="15" fill="#000000"/>
        <rect x="25" y="75" width="20" height="10" fill="#000000"/>
        <rect x="55" y="80" width="15" height="15" fill="#000000"/>
        <rect x="80" y="75" width="40" height="40" fill="#000000" rx="4"/>
        <rect x="88" y="83" width="24" height="24" fill="#ffffff" rx="2"/>
        <rect x="94" y="89" width="12" height="12" fill="#00bf72" rx="1"/>
        <rect x="130" y="80" width="15" height="10" fill="#000000"/>
        <rect x="155" y="75" width="25" height="15" fill="#000000"/>
        <rect x="20" y="105" width="15" height="15" fill="#000000"/>
        <rect x="45" y="100" width="25" height="10" fill="#000000"/>
        <rect x="130" y="100" width="20" height="25" fill="#000000"/>
        <rect x="160" y="110" width="20" height="10" fill="#000000"/>
        <rect x="75" y="125" width="20" height="15" fill="#000000"/>
        <rect x="105" y="130" width="15" height="15" fill="#000000"/>
        <rect x="130" y="135" width="15" height="20" fill="#000000"/>
        <rect x="155" y="145" width="25" height="10" fill="#000000"/>
        <rect x="75" y="150" width="15" height="30" fill="#000000"/>
        <rect x="100" y="155" width="20" height="15" fill="#000000"/>
        <rect x="130" y="165" width="25" height="15" fill="#000000"/>
        <rect x="165" y="165" width="15" height="15" fill="#000000"/>
      </svg>`;

      const qrCodeImage = `data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      pixData = {
        qrCodeImage,
        copiaECola,
        expiresAt,
      };
    }

    const isPix = payload.paymentMethod === 'PIX';

    const demoOrder: DemoOrder = {
      id: orderId,
      orderNumber: orderNum,
      client: payload.customerName,
      email: payload.customerEmail,
      phone: payload.customerPhone,
      cpf: payload.customerCpf,
      date: formattedDate,
      total,
      subtotal,
      shippingCost,
      shippingMethod: payload.shippingMethod || 'Correios PAC',
      status: isPix ? 'pending' : 'paid',
      statusLabel: isPix ? 'Aguardando Pagamento' : 'Pago',
      itemsCount: payload.items.reduce((s, i) => s + i.quantity, 0),
      paymentMethod: payload.paymentMethod,
      trackingCode: isPix ? undefined : 'BR' + Math.floor(100000000 + Math.random() * 900000000) + 'SL',
      street: payload.address.street,
      number: payload.address.number,
      complement: payload.address.complement,
      neighborhood: payload.address.neighborhood,
      city: payload.address.city,
      state: payload.address.state,
      postalCode: payload.address.postalCode,
      items: payload.items.map((i, idx) => ({
        id: `item-${idx}`,
        name: i.name,
        image: i.image,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.price,
        total: i.price * i.quantity,
      })),
      pix: pixData,
    };

    this.demoStorage.addOrder(demoOrder);

    const response: CheckoutResponse = {
      success: true,
      orderId,
      orderNumber: orderNum,
      paymentMethod: payload.paymentMethod,
      status: isPix ? 'PENDING_PAYMENT' : 'CONFIRMED',
      total,
      installments: payload.installments || 1,
      message: isPix ? 'Código PIX gerado com sucesso' : 'Pagamento via cartão aprovado instantaneamente!',
      pix: pixData,
      isSimulator: true,
    };

    return of(response).pipe(delay(600));
  }

  /**
   * Obtém detalhes de um pedido por ID ou número
   */
  getOrderDetails(id: string): Observable<OrderStatusResponse> {
    const order = this.demoStorage.getOrderById(id);
    if (!order) {
      return of({
        orderId: id,
        orderNumber: id,
        status: 'PAID',
        isPaid: true,
        total: 159.90,
        paymentMethod: 'PIX',
      });
    }

    return of({
      orderId: order.id,
      orderNumber: order.orderNumber || order.id,
      status: order.status === 'paid' ? 'PAID' : (order.status === 'pending' ? 'PENDING_PAYMENT' : order.status.toUpperCase()),
      isPaid: order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered',
      total: order.total,
      subtotal: order.subtotal || order.total,
      shippingCost: order.shippingCost || 0,
      shippingMethod: order.shippingMethod || 'Correios PAC',
      paymentMethod: order.paymentMethod || 'PIX',
      customerName: order.client,
      customerEmail: order.email,
      customerPhone: order.phone,
      street: order.street,
      number: order.number,
      complement: order.complement,
      neighborhood: order.neighborhood,
      city: order.city,
      state: order.state,
      postalCode: order.postalCode,
      trackingCode: order.trackingCode,
      items: order.items || [],
      pix: order.pix,
    }).pipe(delay(200));
  }

  /**
   * Obtém status simplificado para polling do PIX
   */
  getOrderStatus(id: string): Observable<OrderStatusResponse> {
    return this.getOrderDetails(id);
  }

  /**
   * Simula a aprovação imediata do PIX no modo demonstração
   */
  simulatePaymentApproval(orderId: string): Observable<any> {
    const trackingCode = 'BR' + Math.floor(100000000 + Math.random() * 900000000) + 'SL';
    this.demoStorage.updateOrderStatus(orderId, 'paid', trackingCode);
    return of({ success: true, message: 'Pagamento aprovado!' }).pipe(delay(400));
  }
}
