// Owner: Mina — feature: checkout/routes
import { Routes } from '@angular/router';

export const checkoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./checkout-page/checkout-page').then((m) => m.CheckoutPage),
  },
  {
    path: 'success',
    loadComponent: () => import('./payment-success/payment-success').then((m) => m.PaymentSuccess),
  },
  {
    path: 'failure',
    loadComponent: () => import('./payment-failure/payment-failure').then((m) => m.PaymentFailure),
  },
];
