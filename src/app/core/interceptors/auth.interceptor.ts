// Owner: Mina — feature: core/interceptors/auth
// Route E-commerce API uses a custom `token` header (see Postman collection)
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (!token) return next(req);
  return next(
    req.clone({
      setHeaders: { token },
    }),
  );
};
