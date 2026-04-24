// Owner: Noura — feature: subcategories/routes
import { Routes } from '@angular/router';

export const subcategoriesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./subcategories-list/subcategories-list').then((m) => m.SubcategoriesList),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./subcategory-details/subcategory-details').then((m) => m.SubcategoryDetails),
  },
];
