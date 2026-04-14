import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isRefreshCall = req.url.includes('/auth/refresh');
  
  const token = authService.getToken();
  
  if (token && !isRefreshCall) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && !isRefreshCall && authService.getRefreshToken()) {
        return authService.refreshSession().pipe(
          switchMap((isRefreshed) => {
            if (isRefreshed) {
              const retriedToken = authService.getToken();
              const retriedRequest = retriedToken
                ? req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${retriedToken}`,
                    },
                  })
                : req;
              return next(retriedRequest);
            }

            authService.logout();
            router.navigate(['/auth/login']);
            return throwError(() => error);
          })
        );
      }

      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth/login']);
      }

      return throwError(() => error);
    })
  );
};
