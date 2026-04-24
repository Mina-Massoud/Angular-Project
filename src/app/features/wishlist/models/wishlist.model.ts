// Owner: Ahmed Gabr — feature: wishlist/model
import { Product } from '../../products/models/product.model';

export type WishlistItem = Product;

export interface WishlistResponse {
  status: string;
  count: number;
  data: WishlistItem[];
}
