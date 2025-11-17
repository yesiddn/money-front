import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap, Observable } from 'rxjs';
import { finalize, shareReplay, map } from 'rxjs/operators';
import { Token } from './token';
import { ResponseLogin, SignupRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  http = inject(HttpClient);
  tokenService = inject(Token);
  apiURL = environment.API_URL;
  private refreshInProgress$?: Observable<void>;

  login(username: string, password: string) {
    return this.http.post<ResponseLogin>(`${this.apiURL}/api/token/`, { username, password })
      .pipe(
        tap({
          next: (response) => {
            this.tokenService.saveAccessToken(response.access);
            this.tokenService.saveRefreshToken(response.refresh);
          },
          error: (error) => {
            console.error('Login failed:', error);
          },
          complete: () => {
            console.log('Login completed');
          }
        })
      )
  }

  signup(signupData: SignupRequest) {
    return this.http.post(`${this.apiURL}/api/auth/signup/`, signupData);
  }

  refreshToken() {
    const refreshToken = this.tokenService.getRefreshToken();

    return this.http.post<ResponseLogin>(`${this.apiURL}/api/token/refresh/`, { refresh: refreshToken })
      .pipe(
        tap({
          next: (response) => {
            this.tokenService.saveAccessToken(response.access);
            this.tokenService.saveRefreshToken(response.refresh);
          },
          error: (error) => {
            console.error('Token refresh failed:', error);
            this.logout();
          }
        })
      )
  }

  // Refresh compartido: asegura que solo haya una llamada de refresh en curso
  refreshTokenShared(): Observable<void> {
    if (!this.refreshInProgress$) {
      this.refreshInProgress$ = this.refreshToken().pipe(
        map(() => void 0),
        shareReplay(1),
        finalize(() => {
          this.refreshInProgress$ = undefined;
        })
      );
    }

    return this.refreshInProgress$;
  }

  logout() {
    this.tokenService.removeAccessToken();
    this.tokenService.removeRefreshToken();
  }
}
