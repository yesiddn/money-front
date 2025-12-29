import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ManageRecordsDialogs } from '../manage-records-dialogs';
import { ManageRecords } from '../manage-records';
import { FinancialTransactions } from '@app/transactions/financial-transactions';
import { Record } from '@app/models/record.intereface';
import { Category } from '@app/models/category.interface';
import { Currency } from '@app/models/currency.interface';
import { ManageAccounts } from '@app/accounts/manage-accounts';
import { ManageCurrencies } from '@app/currencies/manage-currencies';
import { ManageCategories } from '@app/categories/manage-categories';
import { Account } from '@app/models/account.interface';

@Component({
  selector: 'app-edit-records',
  imports: [
    ReactiveFormsModule,
    Dialog,
    ButtonModule,
    Message,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    DatePicker,
    Select,
  ],
  templateUrl: './edit-records.html',
  styleUrl: './edit-records.css',
})
export class EditRecords implements OnInit {
  private fb = inject(FormBuilder);
  private manageRecordsDialogs = inject(ManageRecordsDialogs);
  private manageRecordsService = inject(ManageRecords);
  private financialTransactions = inject(FinancialTransactions);
  private manageAccounts = inject(ManageAccounts);
  private manageCurrencies = inject(ManageCurrencies);
  private manageCategories = inject(ManageCategories);

  currentRecord = input<Record | null>(null);
  updatedRecord = output<Record>();

  accounts = signal<Account[]>([]);
  categories = signal<Category[]>([]);
  currencies = signal<Currency[]>([]);
  dialogVisible = false;
  form!: FormGroup;
  formSubmitted = false;
  typeRecords = [
    { label: 'Gasto', value: 'expense' },
    { label: 'Ingreso', value: 'income' },
    { label: 'Transferencia', value: 'transfer' },
    { label: 'Inversión', value: 'investment' },
  ];
  paymentTypes = [
    { label: 'Efectivo', value: 'cash' },
    { label: 'Transferencia', value: 'transfer' },
    { label: 'Tarjeta', value: 'card' },
  ];

  constructor() {
    effect(() => {
      this.dialogVisible = this.manageRecordsDialogs.editRecordDialogVisibleState();

      if (this.dialogVisible && this.currentRecord()) {
        const record = this.currentRecord()!;
        this.form.patchValue({
          title: record.title,
          description: record.description || '',
          amount: parseFloat(record.amount),
          account: record.account ? record.account.id : '',
          from_account: record.from_account ? record.from_account.id : '',
          to_account: record.to_account ? record.to_account.id : '',
          typeRecord: record.typeRecord,
          category: record.category ? record.category.id : '',
          paymentType: record.paymentType,
          currency: record.currency,
          date: record.date_time || '',
        });
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.initializeUserFinancialData();
  }

  private initFormValues() {
    return {
      title: '',
      description: '',
      amount: null,
      account: this.accounts().length > 0 ? this.accounts()[0].id : '',
      typeRecord: this.typeRecords[0].value,
      category: '',
      paymentType: this.paymentTypes[0].value,
      currency: this.accounts().length > 0 ? this.accounts()[0].currency : '',
      date: '',
    };
  }

  initializeUserFinancialData() {
    this.manageAccounts.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts.set(accounts);
        this.form.patchValue({ account: accounts.length > 0 ? accounts[0].id : '' });
        this.form.patchValue({ currency: accounts.length > 0 ? accounts[0].currency : '' });
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      },
    });

    this.manageCategories.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });

    this.manageCurrencies.getCurrencies().subscribe({
      next: (currencies) => {
        this.currencies.set(currencies);
      },
      error: (error) => {
        console.error('Error loading currencies:', error);
      },
    });
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      account: [''],
      from_account: [''],
      to_account: [''],
      typeRecord: [this.typeRecords[0].value, Validators.required],
      category: [''],
      paymentType: [this.paymentTypes[0].value, Validators.required],
      currency: [{ value: '', disabled: true }, Validators.required],
      date: [''],
    });

    this.form.get('account')?.valueChanges.subscribe(value => {
      const selectedAccount = this.accounts().find(account => account.id === value);

      if (selectedAccount) {
        this.form.patchValue({ currency: selectedAccount.currency });
      }
    });
  }

  saveRecord() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formSubmitted = false;
      return;
    }

    this.formSubmitted = true;

    const recordData = this.form.getRawValue();
    const { account, from_account, to_account, category, date, ...rest } = recordData;

    if (recordData.typeRecord === 'transfer') {
      if (!from_account || !to_account) {
        this.form.get('from_account')?.setErrors({ required: true });
        this.form.get('to_account')?.setErrors({ required: true });
        this.formSubmitted = false;
        return;
      }

      if (from_account === to_account) {
        this.form.get('to_account')?.setErrors({ sameAccount: true });
        this.formSubmitted = false;
        return;
      }
    }
    else if (!account) {
      this.form.get('account')?.setErrors({ required: true });
      this.formSubmitted = false;
      return;
    }

    const finalData = {
      ...rest,
      category_id: category,
      date_time: date ? date.toISOString() : null,
    };

    if (recordData.typeRecord === 'transfer') {
      Object.assign(finalData, {
        from_account_id: from_account,
        to_account_id: to_account,
      });
    } else {
      Object.assign(finalData, {
        account_id: account,
      });
    }

    const currentRecordId = this.currentRecord()?.id;

    if (!currentRecordId) {
      console.error('No record selected for editing.');
      this.formSubmitted = false;
      return;
    }

    this.manageRecordsService.updateRecord(currentRecordId, finalData).subscribe({
      next: (updatedRecord) => {
        this.hideDialog();
        this.form.reset(this.initFormValues());
        this.formSubmitted = false;
        this.updatedRecord.emit(updatedRecord);
      },
      error: (error) => {
        console.error('Error creating record:', error);
      },
    });
  }

  onFromAccountChange(fromAccountId: number) {
    const selectedAccount = this.accounts().find(account => account.id === fromAccountId);

    if (this.form.get('to_account')?.value === fromAccountId) {
      this.form.get('to_account')?.setErrors({ sameAccount: true });
    } else {
      this.form.get('to_account')?.setErrors(null);
    }

    if (selectedAccount) {
      this.form.patchValue({ currency: selectedAccount.currency });
    }
  }

  onToAccountChange(toAccountId: number) {
    if (this.form.get('from_account')?.value === toAccountId) {
      this.form.get('to_account')?.setErrors({ sameAccount: true });
    } else {
      this.form.get('to_account')?.setErrors(null);
    }
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido.';
    }
    if (controlName === 'to_account' && control?.hasError('sameAccount')) {
      return 'La cuenta de destino no puede ser la misma que la de origen.';
    }
    return 'Campo inválido.';
  }

  hideDialog() {
    this.form.reset(this.initFormValues());
    this.formSubmitted = false;
    this.manageRecordsDialogs.hideEditRecordDialog();
  }
}

