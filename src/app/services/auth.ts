import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  http = inject(HttpClient);
   apiURL = environment.API_URL;

  login(username: string, password: string) {
    return this.http.post(`${this.apiURL}/api/login`, { username, password });
  }
}
