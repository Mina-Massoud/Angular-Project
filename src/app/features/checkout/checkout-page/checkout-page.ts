// Owner: Mina — feature: checkout/checkout-page
// API contract (Postman):
//   POST  /api/v1/orders/:cartId                    body: { shippingAddress: { details, phone, city } }
//   POST  /api/v1/orders/checkout-session/:cartId   query: ?url=<successUrl>  body: { shippingAddress }
import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage {
  // TODO: Mina — build address form, choose cash vs online, call OrdersService
}
