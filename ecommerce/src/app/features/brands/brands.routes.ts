// Owner: Noura — feature: brands/routes
import { Routes } from '@angular/router';

export const brandsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./brands-list/brands-list').then((m) => m.BrandsList),
  },
  {
    path: ':id',
    loadComponent: () => import('./brand-details/brand-details').then((m) => m.BrandDetails),
  },
];
