// Owner: Mina — feature: home/routes
import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home-page/home-page').then((m) => m.HomePage),
  },
];
