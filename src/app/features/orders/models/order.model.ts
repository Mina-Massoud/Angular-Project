// Owner: Mostafa Shanab — feature: orders/model
import { Product } from '../../products/models/product.model';

export interface OrderItem {
  count: number;
  price: number;
  product: Product;
  _id: string;
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface Order {
  _id: string;
  user: string;
  cartItems: OrderItem[];
  totalOrderPrice: number;
  shippingPrice: number;
  taxPrice: number;
  paymentMethodType: 'cash' | 'card';
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}
