import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Token } from '../services/token';
import { Auth } from '../services/auth';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs';

export const redirectGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(Token);
  const router = inject(Router);

  const isValidAccessToken = tokenService.isValidAccessToken();
  const isValidRefreshToken = tokenService.isValidRefreshToken();

  if (isValidAccessToken) {
    router.navigate(['/']);
    return false;
  }

  if (!isValidRefreshToken) {
    tokenService.clearTokens();
    return true;
  }

  return updateTokens(router);
};

function updateTokens(router: Router) {
  const authService = inject(Auth);

  return authService.refreshTokenShared().pipe(
    map(() => true),
    catchError((err) => {
      router.navigate(['/']);
      return of(false);
    })
  );
}
