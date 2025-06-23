import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const roleInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const actualRole = user?.role;

      const isAdminRoute = window.location.hash.includes('/administration');
      const roleToSend = isAdminRoute ? 'Admin' : actualRole;

      if (roleToSend) {
        request = request.clone({
          setHeaders: {
            'X-Role': roleToSend,
          },
        });
      }
    }
  } catch (error) {
    console.warn('Error parsing user from localStorage', error);
  }

  return next(request).pipe(
    catchError((error: any) => {
      if (error.status === 403) {
        router.navigate(['/not-allowed']);
      }
      return throwError(() => error);
    }),
  );
};
