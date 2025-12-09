import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { checkToken } from '../../interceptors/token-interceptor';
import { Record, RecordsResponse } from '../../models/record.intereface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialTransactions {
  http = inject(HttpClient);
  apiURL = environment.API_URL;

  getRecords(limit: number, offset: number) {
    return this.http.get<RecordsResponse>(`${this.apiURL}/api/records/?limit=${limit}&offset=${offset}`, { context: checkToken() }).pipe(
      map((data: RecordsResponse) => {
        let response: RecordsResponse = data;

        response.results = response.results.map(record => ({
          ...record,
          date_time: new Date(record.date_time)
        }));

        return response;
      })
    );
  }
}
