// Owner: Mostafa Shanab — feature: orders/model
import { Product } from '../../products/models/product.model';

export interface OrderItem {
  count: number;
  price: number;
  product: Product;
}

export interface Order {
  _id: string;
  user: string;
  cartItems: OrderItem[];
  totalOrderPrice: number;
  paymentMethodType: 'cash' | 'card';
  isPaid: boolean;
  isDelivered: boolean;
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
  createdAt: string;
  // TODO: Mostafa Shanab — extend per API response
}
