import { Component, effect, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManageAccounts } from '@app/accounts/manage-accounts';
import { ManageCurrencies } from '@app/currencies/manage-currencies';
import { Account } from '@app/models/account.interface';
import { Currency } from '@app/models/currency.interface';
import { ManageDialogs } from '@app/shared/dialogs/manage-dialogs';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-create-accounts',
  imports: [
    ReactiveFormsModule,
    Dialog,
    ButtonModule,
    Message,
    InputTextModule,
    InputNumberModule,
    AutoComplete,
  ],
  templateUrl: './create-accounts.html',
  styleUrl: './create-accounts.css',
})
export class CreateAccounts implements OnInit {
  private fb = inject(FormBuilder);
  private manageDialogs = inject(ManageDialogs);
  private manageAccounts = inject(ManageAccounts);
  private manageCurrencies = inject(ManageCurrencies);

  newAccount = output<Account>();

  currencies = signal<Currency[]>([]);
  filteredCurrencies = signal<Currency[]>([]);
  selectedCurrency: Currency | null = null;
  dialogVisible = false;
  form!: FormGroup;
  formSubmitted = false;

  constructor() {
    effect(() => {
      this.dialogVisible = this.manageDialogs.createAccountDialogVisibleState();
    });
  }

  ngOnInit() {
    this.initForm();
    this.loadCurrencies();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      balance: [null, Validators.required],
      currency: ['', Validators.required],
    });
  }

  loadCurrencies() {
    this.manageCurrencies.getCurrencies().subscribe({
      next: (currencies) => {
        this.currencies.set(currencies);
      },
      error: (error) => {
        console.error('Error loading currencies:', error);
      },
    });
  }

  saveAccount() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formSubmitted = false;
      return;
    }

    this.formSubmitted = true;

    const accountData = this.form.getRawValue();
    const { currency, ...rest } = accountData;

    const finalData = {
      ...rest,
      currency: currency.code,
    };

    this.manageAccounts.createAccount(finalData).subscribe({
      next: (newAccount) => {
        this.newAccount.emit(newAccount);
        this.form.reset();
        this.formSubmitted = false;
        this.hideDialog();
      },
      error: (error) => {
        console.error('Error creating account:', error);
      }
    });
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  filterCurrencies(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    const filtered = this.currencies().filter(currency =>
      currency.code.toLowerCase().includes(query) ||
      currency.name.toLowerCase().includes(query)
    );

    this.filteredCurrencies.set(filtered);
  }

  hideDialog() {
    this.form.reset();
    this.formSubmitted = false;
    this.manageDialogs.hideCreateAccountDialog();
  }
}
