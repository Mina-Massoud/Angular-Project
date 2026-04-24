// Owner: Ahmed Gabr — feature: wishlist/routes
import { Routes } from '@angular/router';

export const wishlistRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./wishlist-page/wishlist-page').then((m) => m.WishlistPage),
  },
];
