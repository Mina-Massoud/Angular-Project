// Owner: Ahmed Gabr — feature: cart/model
import { Product } from '../../products/models/product.model';

// export interface CartItem {
//   _id: string;
//   product: Product;
//   count: number;
//   price: number;
// }

// export interface Cart {
//   _id: string;
//   cartOwner: string;
//   products: CartItem[];
//   totalCartPrice: number;
//   // TODO: Ahmed Gabr — extend per API response
// }
///////
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




