import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { checkToken } from '../../interceptors/token-interceptor';
import { Record } from '../../models/record.intereface';

@Injectable({
  providedIn: 'root'
})
export class FinancialTransactions {
  http = inject(HttpClient);
  apiURL = environment.API_URL;

  getRecords() {
    return this.http.get<Record[]>(`${this.apiURL}/api/records/`, { context: checkToken() });
  }
}
