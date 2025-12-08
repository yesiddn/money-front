import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { checkToken } from '../../interceptors/token-interceptor';
import { Record } from '../../models/record.intereface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialTransactions {
  http = inject(HttpClient);
  apiURL = environment.API_URL;

  getRecords() {
    return this.http.get<Record[]>(`${this.apiURL}/api/records/`, { context: checkToken() }).pipe(
      map((data: Record[]) => {
        return data.map(record => ({
          ...record,
          date_time: new Date(record.date_time)
        }));
      })
    );
  }
}
