import { Component, computed, effect, inject, OnInit, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ManageRecordsDialogs } from '@transactions/manage-records/manage-records-dialogs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { FinancialTransactions } from '@app/transactions/financial-transactions';
import { Account, Record } from '@app/models/record.intereface';
import { Category } from '@app/models/category.interface';
import { Currency } from '@app/models/currency.interface';
import { ManageRecords } from '../manage-records';

@Component({
  selector: 'app-create-records',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    Message,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    DatePickerModule,
    Select,
  ],
  templateUrl: './create-records.html',
})
export class CreateRecords implements OnInit {
  private fb = inject(FormBuilder);
  private manageRecordsDialogs = inject(ManageRecordsDialogs);
  private magageRecords = inject(ManageRecords);
  private financialTransactions = inject(FinancialTransactions);

  newRecord = output<Record>();

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
      this.dialogVisible = this.manageRecordsDialogs.createRecordDialogVisibleState();
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
    this.financialTransactions.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts.set(accounts);
        this.form.patchValue({ account: accounts.length > 0 ? accounts[0].id : '' });
        this.form.patchValue({ currency: accounts.length > 0 ? accounts[0].currency : '' });
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      },
    });

    this.financialTransactions.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });

    this.financialTransactions.getCurrencies().subscribe({
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
      account: ['', Validators.required],
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
    const { account, category, date, ...rest } = recordData;

    const finalData = {
      ...rest,
      account_id: account,
      category_id: category,
      date_time: date ? date.toISOString() : undefined,
    };

    this.magageRecords.createRecord(finalData).subscribe({
      next: (newRecord) => {
        this.newRecord.emit(newRecord);
        this.hideDialog();
        this.form.reset(this.initFormValues());
        this.formSubmitted = false;
      },
      error: (error) => {
        console.error('Error creating record:', error);
      },
    });
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  hideDialog() {
    this.form.reset(this.initFormValues());
    this.formSubmitted = false;
    this.manageRecordsDialogs.hideCreateRecordDialog();
  }
}
