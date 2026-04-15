import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { checkToken } from '@app/interceptors/token-interceptor';
import { Category, CreateCategory } from '@app/models/category.interface';
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
    if (this.categories().length > 0) {
      return of(this.categories());
    }

    if (this.categoriesRequest$) {
      return this.categoriesRequest$;
    }

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

  refreshCategories() {
    this.categories.set([]);
    this.categoriesRequest$ = null;
    return this.getCategories();
  }

  createCategory(categoryData: CreateCategory) {
    return this.http
      .post<Category>(`${this.apiURL}/api/categories/`, categoryData, { context: checkToken() })
      .pipe(
        map((newCategory: Category) => {
          this.categories.set([...this.categories(), newCategory]);
          return newCategory;
        })
      );
  }

  updateCategory(categoryId: number, categoryData: CreateCategory) {
    return this.http
      .put<Category>(`${this.apiURL}/api/categories/${categoryId}/`, categoryData, { context: checkToken() })
      .pipe(
        map((updatedCategory: Category) => {
          this.categories.update(categories => categories.map(category =>
            category.id === updatedCategory.id ? updatedCategory : category
          ));
          return updatedCategory;
        })
      );
  }

  deleteCategory(categoryId: number) {
    return this.http
      .delete<void>(`${this.apiURL}/api/categories/${categoryId}/`, { context: checkToken() })
      .pipe(
        map(() => {
          this.categories.update(categories => categories.filter(c => c.id !== categoryId));
          return categoryId;
        })
      );
  }
}
