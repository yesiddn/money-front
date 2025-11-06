import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';
import { Token } from './token';
import { ResponseLogin, SignupRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  http = inject(HttpClient);
  tokenService = inject(Token);
  apiURL = environment.API_URL;

  login(username: string, password: string) {
    return this.http.post<ResponseLogin>(`${this.apiURL}/api/token/`, { username, password })
      .pipe(
        tap({
          next: (response) => {
            this.tokenService.saveAccessToken(response.access);
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
}
