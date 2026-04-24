// Owner: Ahmed Gabr — feature: cart/service
// API contract (Postman):
//   POST   /api/v1/cart                body: { productId }
//   PUT    /api/v1/cart/:productId     body: { count }
//   GET    /api/v1/cart
//   DELETE /api/v1/cart/:productId
//   DELETE /api/v1/cart                (clear)
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  // TODO: Ahmed Gabr — implement add, updateQty, remove, clear, getUserCart
}
