// Owner: Noura — feature: categories/routes
import { Routes } from '@angular/router';

export const categoriesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./categories-list/categories-list').then((m) => m.CategoriesList),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./category-details/category-details').then((m) => m.CategoryDetails),
  },
];
