import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { checkToken } from '@app/interceptors/token-interceptor';
import { RecordsResponse, TransactionFilters } from '@app/models/record.intereface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialTransactions {
  http = inject(HttpClient);
  apiURL = environment.API_URL;

  getRecords(limit: number, offset: number, filters?: TransactionFilters) {
    const filterParams = new URLSearchParams();
    if (filters) {
      if (filters.searchTerm) {
        filterParams.append('search', filters.searchTerm);
      }
      if (filters.typeRecord) {
        filterParams.append('typeRecord', filters.typeRecord);
      }
      if (filters.dateFrom && filters.dateTo) {
        filterParams.append('date_from', filters.dateFrom);
        filterParams.append('date_to', filters.dateTo);
      }
    }

    filterParams.append('limit', limit.toString());
    filterParams.append('offset', offset.toString());

    const urlWithFilters = `${this.apiURL}/api/records/?${filterParams.toString()}`;

    return this.http.get<RecordsResponse>(urlWithFilters, { context: checkToken() }).pipe(
      map((data: RecordsResponse) => {
        let response: RecordsResponse = data;

        response.results = response.results.map(record => ({
          ...record,
          date_time: record.date_time ? new Date(record.date_time) : record.date_time,
        }));

        return response;
      })
    );
  }
}
