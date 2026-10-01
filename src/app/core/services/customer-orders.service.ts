import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DemoStorageService } from './demo-storage.service';
import { AuthService } from './auth.service';

export interface CustomerOrderItem {
  id: string;
  name: string;
  sku?: string;
  image?: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  total: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCpf: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  subtotal: number;
  shippingCost: number;
  shippingMethod?: string;
  discount: number;
  total: number;
  paymentMethod: 'PIX' | 'CREDIT_CARD';
  status: 'PENDING_PAYMENT' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'CONFIRMED' | 'RECEIVED' | 'OVERDUE' | 'REFUNDED';
  pixQrCodeImage?: string;
  pixCopiaECola?: string;
  pixExpiresAt?: string;
  trackingCode?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  items: CustomerOrderItem[];
}

@Injectable({
  providedIn: 'root',
})
export class CustomerOrdersService {
  private demoStorage = inject(DemoStorageService);
  private authService = inject(AuthService);

  getMyOrders(): Observable<CustomerOrder[]> {
    const rawOrders = this.demoStorage.orders();
    const mapped: CustomerOrder[] = rawOrders.map((ro) => {
      let mappedStatus: CustomerOrder['status'] = 'PAID';
      if (ro.status === 'pending_payment' || ro.status === 'pending') mappedStatus = 'PENDING_PAYMENT';
      else if (ro.status === 'preparing') mappedStatus = 'PREPARING';
      else if (ro.status === 'shipped') mappedStatus = 'SHIPPED';
      else if (ro.status === 'delivered') mappedStatus = 'DELIVERED';
      else if (ro.status === 'cancelled') mappedStatus = 'CANCELLED';

      return {
        id: ro.id,
        orderNumber: ro.orderNumber || ro.id.replace('ord-', ''),
        customerName: ro.client,
        customerEmail: ro.email || 'cliente@email.com',
        customerPhone: ro.phone || '(11) 99999-9999',
        customerCpf: ro.cpf || '000.000.000-00',
        street: ro.street || 'Avenida Paulista',
        number: ro.number || '1000',
        complement: ro.complement || '',
        neighborhood: ro.neighborhood || 'Bela Vista',
        city: ro.city || 'São Paulo',
        state: ro.state || 'SP',
        postalCode: ro.postalCode || '01310-100',
        subtotal: ro.subtotal || ro.total - (ro.shippingCost || 0),
        shippingCost: ro.shippingCost || 0,
        shippingMethod: ro.shippingMethod || 'Correios PAC',
        discount: 0,
        total: ro.total,
        paymentMethod: ro.paymentMethod || 'PIX',
        status: mappedStatus,
        paymentStatus: mappedStatus === 'PAID' || mappedStatus === 'DELIVERED' || mappedStatus === 'SHIPPED' ? 'CONFIRMED' : 'PENDING',
        pixQrCodeImage: ro.pix?.qrCodeImage,
        pixCopiaECola: ro.pix?.copiaECola || '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865405389.705802BR5913Lume Store6009Sao Paulo62070503***6304E2CA',
        pixExpiresAt: ro.pix?.expiresAt,
        trackingCode: ro.trackingCode,
        createdAt: ro.date.includes('/') ? ro.date : new Date().toISOString(),
        items: (ro.items || []).map((it, idx) => ({
          id: it.id || `item-${idx}`,
          name: it.name,
          sku: it.sku,
          image: it.image,
          size: it.size,
          color: it.color,
          price: it.price,
          quantity: it.quantity,
          total: it.total || it.price * it.quantity,
        })),
      };
    });

    return of(mapped);
  }

  getOrder(id: string): Observable<CustomerOrder | undefined> {
    return of(undefined);
  }
}
