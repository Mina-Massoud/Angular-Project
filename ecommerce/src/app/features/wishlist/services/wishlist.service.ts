// Owner: Ahmed Gabr — feature: wishlist/service
// API contract (Postman):
//   POST   /api/v1/wishlist             body: { productId }
//   DELETE /api/v1/wishlist/:productId
//   GET    /api/v1/wishlist
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  // TODO: Ahmed Gabr — implement add(productId), remove(productId), getUserWishlist()
}
