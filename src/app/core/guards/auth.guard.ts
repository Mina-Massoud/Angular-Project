// Owner: Mina — feature: core/guards/auth
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);
  if (auth.isAuthenticated()) return true;
  toast.info('Please sign in to continue.');
  router.navigate(['/auth/sign-in'], {
    queryParams: state.url ? { returnUrl: state.url } : undefined,
  });
  return false;
};
