import { Injectable } from '@angular/core';
import { setCookie, getCookie, removeCookie } from 'typescript-cookie'
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class Token {
  saveAccessToken(token: string): void {
    setCookie('access_token', token, { expires: 365, path: '/' });
  }

  getAccessToken(): string | undefined {
    return getCookie('access_token');
  }

  removeAccessToken(): void {
    removeCookie('access_token', { path: '/' });
  }

  isValidAccessToken(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    const decodeToken = jwtDecode<JwtPayload>(token);
    if (decodeToken && decodeToken?.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);

      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }

    return false;
  }

  // Refresh Token Methods
  saveRefreshToken(token: string): void {
    setCookie('refresh_token', token, { expires: 365, path: '/' });
  }

  getRefreshToken(): string | undefined {
    return getCookie('refresh_token');
  }

  removeRefreshToken(): void {
    removeCookie('refresh_token', { path: '/' });
  }

  isValidRefreshToken(): boolean {
    const refreshtoken = this.getRefreshToken();
    if (!refreshtoken) {
      return false;
    }

    const decodeToken = jwtDecode<JwtPayload>(refreshtoken);
    if (decodeToken && decodeToken?.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);

      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }

    return false;
  }
}
