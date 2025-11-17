import { HttpContext, HttpContextToken, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Token } from '../services/token';
import { Auth } from '../services/auth';
import { switchMap, catchError } from 'rxjs/operators';

// Se define el token de contexto
const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

// Función para establecer el contexto en una solicitud HTTP
export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(CHECK_TOKEN)) {
    return next(req);
  }

  const tokenService = inject(Token);

  const isValidAccessToken = tokenService.isValidAccessToken();

  if (isValidAccessToken) {
    return addAccessToken(req, next, tokenService);
  } else {
    return updateTokens(req, next, tokenService);
  }

  return next(req);
};

function addAccessToken(req: HttpRequest<unknown>, next: HttpHandlerFn, tokenService: Token) {
  const accessToken = tokenService.getAccessToken();

  if (!accessToken) {
    return next(req);
  }

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
  });

  return next(authReq);
}

function updateTokens(req: HttpRequest<unknown>, next: HttpHandlerFn, tokenService: Token) {
  const refreshToken = tokenService.getRefreshToken();

  // Si hay refresh token intentamos refrescar primero
  if (refreshToken) {
    const authService = inject(Auth);
    return authService.refreshTokenShared().pipe(
      switchMap(() => addAccessToken(req, next, tokenService)),
      catchError(() => {
        // Si falla el refresh, dejamos pasar la petición original sin auth
        return next(req);
      })
    );
  }

  return next(req);
}
