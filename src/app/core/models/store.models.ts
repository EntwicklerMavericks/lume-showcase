/**
 * Lume — Modelos da loja de moda premium.
 * Preparados para desacoplamento e integração transparente com API NestJS.
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  available: boolean;
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  promotionalPrice?: number;
  images: string[];
  categoryId: string;
  category?: Category;
  sizes?: string[];
  colors?: ProductColor[];
  composition?: string;
  fit?: string; // Ex: 'Slim Fit', 'Oversized', 'Regular'
  washCare?: string;
  available: boolean;
  featured?: boolean;
  isNew?: boolean;
  variants?: ProductVariant[];
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface StoreConfig {
  name: string;
  whatsappNumber: string;
  currency: string;
  locale: string;
  whatsappGreeting: string;
  whatsappClosing: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  service: string;
  deadline: string;
  price: number;
  originalPrice: number;
  isFree: boolean;
}

export interface ShippingResult {
  origin: {
    postalCode: string;
    street: string;
    city: string;
    state: string;
  };
  destination: {
    postalCode: string;
    city: string;
    state: string;
  };
  freeShippingQualified: boolean;
  freeShippingThreshold: number;
  options: ShippingOption[];
}

export interface CheckoutAddress {
  postalCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface CheckoutItem {
  productId: string;
  name: string;
  sku?: string;
  image?: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
}

export interface CreditCardData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface CreditCardHolderInfo {
  name: string;
  email: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  addressComplement?: string;
  phone: string;
}

export interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerPhone: string;
  address: CheckoutAddress;
  items: CheckoutItem[];
  paymentMethod: 'PIX' | 'CREDIT_CARD';
  creditCard?: CreditCardData;
  creditCardHolder?: CreditCardHolderInfo;
  installments?: number;
  shippingCost?: number;
  shippingMethod?: string;
  customerNotes?: string;
}

export interface CheckoutResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  paymentMethod: 'PIX' | 'CREDIT_CARD';
  status: string;
  total: number;
  installments?: number;
  message?: string;
  pix?: {
    qrCodeImage: string;
    copiaECola: string;
    expiresAt: string;
  };
  isSimulator?: boolean;
}

export interface OrderStatusResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  isPaid: boolean;
  total: number;
  subtotal?: number;
  shippingCost?: number;
  shippingMethod?: string;
  paymentMethod: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  trackingCode?: string;
  items?: any[];
  pix?: {
    qrCodeImage: string;
    copiaECola: string;
    expiresAt: string;
  } | null;
}

export interface ViaCepResult {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

