// Owner: Mina — feature: core/interceptors/error
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

// Coalesces parallel 401/403 responses so the user sees one toast and one
// redirect even when several in-flight requests fail at the same time.
const AUTH_DEDUP_WINDOW_MS = 1500;
let lastAuthHandledAt = 0;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const serverMsg = backendMessage(err);

      switch (err.status) {
        case 401:
        case 403: {
          const wasAuthed = auth.isAuthenticated();

          // Public pages can legitimately receive 401 (bad request, stale
          // cache, etc.). Don't yank guests away from the page they're on.
          if (!wasAuthed) {
            if (serverMsg) toast.error(serverMsg);
            break;
          }

          const now = Date.now();
          if (now - lastAuthHandledAt < AUTH_DEDUP_WINDOW_MS) break;
          lastAuthHandledAt = now;

          toast.error(serverMsg ?? 'Your session expired. Please sign in again.');
          // logout() clears the token and navigates to /auth/sign-in.
          auth.logout();
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
