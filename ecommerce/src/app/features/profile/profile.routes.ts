// Owner: Mostafa Shanab — feature: profile/routes
import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile-page/profile-page').then((m) => m.ProfilePage),
  },
  {
    path: 'change-password',
    loadComponent: () => import('./change-password/change-password').then((m) => m.ChangePassword),
  },
  {
    path: 'addresses',
    loadComponent: () => import('./addresses/addresses').then((m) => m.Addresses),
  },
];
