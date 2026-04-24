// Owner: Youssef — feature: products/routes
import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./products-list/products-list').then((m) => m.ProductsList),
  },
  {
    path: ':id',
    loadComponent: () => import('./product-details/product-details').then((m) => m.ProductDetails),
  },
];
