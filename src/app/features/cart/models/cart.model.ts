// Owner: Ahmed Gabr — feature: cart/model
import { Product } from '../../products/models/product.model';


export interface CartItem {
  product: Product;
  count: number;
  price: number;
}


export interface Cart {
  numOfCartItems: number;
  cartId: string;
  data: Data;
}

export interface Data {
  _id: string;
  cartOwner: string;
  totalCartPrice: number;
  products: CartItem[];
}




