// Owner: Mina — root routes (lazy-loaded per feature)
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },

  // Public catalog browsing
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then((m) => m.productsRoutes),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./features/categories/categories.routes').then((m) => m.categoriesRoutes),
  },
  {
    path: 'subcategories',
    loadChildren: () =>
      import('./features/subcategories/subcategories.routes').then((m) => m.subcategoriesRoutes),
  },
  {
    path: 'brands',
    loadChildren: () => import('./features/brands/brands.routes').then((m) => m.brandsRoutes),
  },

  // Protected — requires auth
  {
    path: 'cart',
    canActivate: [authGuard],
    loadChildren: () => import('./features/cart/cart.routes').then((m) => m.cartRoutes),
  },
  {
    path: 'wishlist',
    canActivate: [authGuard],
    loadChildren: () => import('./features/wishlist/wishlist.routes').then((m) => m.wishlistRoutes),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadChildren: () => import('./features/orders/orders.routes').then((m) => m.ordersRoutes),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadChildren: () => import('./features/checkout/checkout.routes').then((m) => m.checkoutRoutes),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./features/profile/profile.routes').then((m) => m.profileRoutes),
  },

  { path: '**', redirectTo: '' },
];
