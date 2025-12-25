import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { checkToken } from '@app/interceptors/token-interceptor';
import { Category } from '@app/models/category.interface';
import { environment } from '@env/environment';
import { map, Observable, of, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManageCategories {
  private http = inject(HttpClient);
  private apiURL = environment.API_URL;

  private categories = signal<Category[]>([]);
  private categoriesRequest$: Observable<Category[]> | null = null;

  getCategories() {
    // Si ya hay datos en cache, retornarlos
    if (this.categories().length > 0) {
      return of(this.categories());
    }

    if (this.categoriesRequest$) {
      return this.categoriesRequest$;
    }

    // Crear nueva petición y cachearla
    this.categoriesRequest$ = this.http.get<Category[]>(`${this.apiURL}/api/categories/`, { context: checkToken() }).pipe(
      map((data: Category[]) => {
        this.categories.set(data);
        return data;
      }),
      tap(() => {
        this.categoriesRequest$ = null;
      }),
      shareReplay(1)
    );

    return this.categoriesRequest$;
  }

  refreshAccounts() {
    this.categories.set([]);
    this.categoriesRequest$ = null;
    return this.getCategories();
  }
}
