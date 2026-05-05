// Owner: Mina — feature: core/interceptors/error
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const serverMsg = backendMessage(err);

      switch (err.status) {
        case 401:
        case 403: {
          const wasAuthed = auth.isAuthenticated();
          if (wasAuthed) auth.logout();

          if (serverMsg) {
            toast.error(serverMsg);
          } else if (wasAuthed) {
            toast.error('Your session expired. Please sign in again.');
          } else {
            toast.info('Please sign in to continue.');
          }

          const returnUrl = router.url && router.url !== '/' ? router.url : undefined;
          router.navigate(
            ['/auth/sign-in'],
            returnUrl ? { queryParams: { returnUrl } } : undefined,
          );
          break;
        }
        case 404:
          toast.error(serverMsg ?? 'Resource not found.');
          break;
        case 0:
          toast.error('Network error. Check your connection and try again.');
          break;
        case 500:
          toast.error(serverMsg ?? 'Server error. Please try again later.');
          break;
        default:
          toast.error(serverMsg ?? 'Unexpected error');
      }
      return throwError(() => err);
    }),
  );
};

function backendMessage(err: HttpErrorResponse): string | null {
  const body = err.error;
  if (!body) return null;
  if (typeof body === 'string' && body.trim()) return body.trim();
  if (typeof body.message === 'string' && body.message.trim()) return body.message.trim();
  if (Array.isArray(body.errors) && body.errors[0]?.msg) return String(body.errors[0].msg);
  return null;
}
