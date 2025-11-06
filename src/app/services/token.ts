import { Injectable } from '@angular/core';
import { setCookie, getCookie, removeCookie } from 'typescript-cookie'

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
}
