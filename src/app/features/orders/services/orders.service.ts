// Owner: Mostafa Shanab — feature: orders/service
// API contract (Postman):
//   POST /api/v1/orders/:cartId                          body: { shippingAddress: { details, phone, city } }   (Cash)
//   POST /api/v1/orders/checkout-session/:cartId?url=…   body: { shippingAddress }                              (Online)
//   GET  /api/v1/orders
//   GET  /api/v1/orders/user/:userId
//
// NOTE: Mina's checkout page imports this service. Keep public method names stable.
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  createCashOrder(_cartId: string, _shippingAddress: ShippingAddress): Observable<unknown> {
    // TODO: Mostafa Shanab
    return of(null);
  }

  createCheckoutSession(
    _cartId: string,
    _shippingAddress: ShippingAddress,
    _successUrl: string,
  ): Observable<unknown> {
    // TODO: Mostafa Shanab
    return of(null);
  }

  getAllOrders(): Observable<unknown[]> {
    // TODO: Mostafa Shanab
    return of([]);
  }

  getUserOrders(_userId: string): Observable<unknown[]> {
    // TODO: Mostafa Shanab
    return of([]);
  }
}
