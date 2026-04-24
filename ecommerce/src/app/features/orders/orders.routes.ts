// Owner: Mostafa Shanab — feature: orders/routes
import { Routes } from '@angular/router';

export const ordersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./orders-list/orders-list').then((m) => m.OrdersList),
  },
  {
    path: ':id',
    loadComponent: () => import('./order-details/order-details').then((m) => m.OrderDetails),
  },
];
