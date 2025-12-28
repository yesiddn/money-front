import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { checkToken } from '@app/interceptors/token-interceptor';
import { Account, CreateAccount } from '@app/models/account.interface';
import { environment } from '@env/environment';
import { map, Observable, of, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManageAccounts {
  private http = inject(HttpClient);
  private apiURL = environment.API_URL;

  private accounts = signal<Account[]>([]);
  private accountsRequest$: Observable<Account[]> | null = null;

  getAccounts() {
    // Si ya hay datos en cache, retornarlos
    if (this.accounts().length > 0) {
      return of(this.accounts());
    }

    // Si ya hay una petición en progreso, retornar ese observable
    if (this.accountsRequest$) {
      return this.accountsRequest$;
    }

    // Crear nueva petición y cachearla
    this.accountsRequest$ = this.http.get<Account[]>(`${this.apiURL}/api/accounts/`, { context: checkToken() }).pipe(
      map((data: Account[]) => {
        this.accounts.set(data);
        return data;
      }),
      tap(() => {
        // Limpiar la petición en progreso cuando termine
        this.accountsRequest$ = null;
      }),
      shareReplay(1) // Compartir el resultado con múltiples suscriptores
    );

    return this.accountsRequest$;
  }

  // Método para forzar recarga de datos
  refreshAccounts() {
    this.accounts.set([]);
    this.accountsRequest$ = null;
    return this.getAccounts();
  }

  createAccount(accountData: CreateAccount) {
    return this.http
      .post<Account>(`${this.apiURL}/api/accounts/`, accountData, {
        context: checkToken(),
      })
      .pipe(
        map((newAccount: Account) => {
          // Actualizar el estado de las cuentas con la nueva cuenta creada
          this.accounts.set([...this.accounts(), newAccount]);
          return newAccount;
        })
      );
  }

  updateAccount(accountId: number, accountData: CreateAccount) {
    return this.http
      .put<Account>(`${this.apiURL}/api/accounts/${accountId}/`, accountData, { context: checkToken() })
      .pipe(
        map((updatedAccount: Account) => {
          // Actualizar el estado de las cuentas con la cuenta actualizada
          this.accounts.update(accounts => accounts.map(account =>
            account.id === updatedAccount.id ? updatedAccount : account
          ));
          return updatedAccount;
        })
      );
  }
}
