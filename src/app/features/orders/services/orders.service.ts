// Owner: Mostafa Shanab — feature: orders/service
// API contract (Postman):
//   POST /api/v1/orders/:cartId                          body: { shippingAddress: { details, phone, city } }   (Cash)
//   POST /api/v1/orders/checkout-session/:cartId?url=…   body: { shippingAddress }                              (Online)
//   GET  /api/v1/orders
//   GET  /api/v1/orders/user/:userId
//
// NOTE: Mina's checkout page imports this service. Keep public method names stable.

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Order, ShippingAddress } from '../models/order.model';

export interface CheckoutSessionResponse {
  status: string;
  session: { url: string };
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.baseUrl;

  createCashOrder(cartId: string, shippingAddress: ShippingAddress): Observable<{ data: Order }> {
    return this.http.post<{ data: Order }>(`${this.base}/orders/${cartId}`, { shippingAddress });
  }

  createCheckoutSession(
    cartId: string,
    shippingAddress: ShippingAddress,
    successUrl: string,
  ): Observable<CheckoutSessionResponse> {
    const url = `${this.base}/orders/checkout-session/${cartId}?url=${encodeURIComponent(successUrl)}`;
    return this.http.post<CheckoutSessionResponse>(url, { shippingAddress });
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/orders`);
  }

  getUserOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/orders/user/${userId}`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<{ data: Order }>(`${this.base}/orders/${id}`).pipe(map((res) => res.data));
  }
}
