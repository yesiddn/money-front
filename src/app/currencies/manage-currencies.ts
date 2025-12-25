import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { checkToken } from '@app/interceptors/token-interceptor';
import { Currency } from '@app/models/currency.interface';
import { environment } from '@env/environment';
import { map, of, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { shareReplay } from 'rxjs/internal/operators/shareReplay';

@Injectable({
  providedIn: 'root',
})
export class ManageCurrencies {
  private http = inject(HttpClient);
  private apiURL = environment.API_URL;

  private currencies = signal<Currency[]>([]);
  private currenciesRequest$: Observable<Currency[]> | null = null;

  getCurrencies() {
    if (this.currencies().length > 0) {
      return of(this.currencies());
    }

    if (this.currenciesRequest$) {
      return this.currenciesRequest$;
    }

    this.currenciesRequest$ = this.http.get<Currency[]>(`${this.apiURL}/api/currencies/`, { context: checkToken() }).pipe(
      map((data: Currency[]) => {
        this.currencies.set(data);
        return data;
      }),
      tap(() => {
        this.currenciesRequest$ = null;
      }),
      shareReplay(1)
    );

    return this.currenciesRequest$;
  }

  refreshCurrencies() {
    this.currencies.set([]);
    this.currenciesRequest$ = null;
    return this.getCurrencies();
  }
}
