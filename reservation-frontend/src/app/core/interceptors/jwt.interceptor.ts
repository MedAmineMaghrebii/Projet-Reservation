import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // On ne tente d'accéder au localStorage que si on est dans le navigateur (client-side)
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('accessToken'); // Vérifiez la clé ('token', 'jwt', etc.)

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authReq);
    }
  }

  // Côté serveur ou si pas de token, on laisse passer la requête originale
  return next(req);
};