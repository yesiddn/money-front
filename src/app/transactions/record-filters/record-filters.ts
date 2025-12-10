import { Component, inject, OnInit, OnDestroy, Output, EventEmitter, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { TransactionFilters } from '../../models/record.intereface';

@Component({
  selector: 'app-record-filters',
  imports: [ReactiveFormsModule, InputTextModule, SelectModule, DatePickerModule, IconFieldModule, InputIconModule],
  templateUrl: './record-filters.html',
})
export class RecordFilters implements OnInit {
  private fb = inject(FormBuilder);

  filtersChange = output<TransactionFilters>();
  filtersForm!: FormGroup;

  readonly recordTypes = [
    { label: 'Ingreso', value: 'income' },
    { label: 'Gasto', value: 'expense' },
    { label: 'Transferencia', value: 'transfer' },
  ];

  ngOnInit() {
    this.initForm();
    this.applyFiltersOnChanges();
  }

  initForm() {
    this.filtersForm = this.fb.group({
      searchTerm: [],
      typeRecord: [],
      date: [],
    });
  }

  applyFiltersOnChanges() {
    this.filtersForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(), // Evita emitir si los valores no han cambiado
      map(formValues => {
        const filters: TransactionFilters = {};
        if (formValues.searchTerm) {
          filters.searchTerm = formValues.searchTerm;
        }
        if (formValues.typeRecord) {
          filters.typeRecord = formValues.typeRecord;
        }
        if (formValues.date) {
          const startOfDay = new Date(formValues.date);
          startOfDay.setHours(0, 0, 0, 0);

          const endOfDay = new Date(formValues.date);
          endOfDay.setHours(23, 59, 59, 999);

          // Convertir a ISO string (automáticamente en UTC)
          filters.dateFrom = startOfDay.toISOString();
          filters.dateTo = endOfDay.toISOString();
        }
        console.log('Applied Filters:', filters);
        return filters;
      })
    ).subscribe(filters => {
      this.filtersChange.emit(filters);
    });
  }

  resetSearchTerm() {
    this.filtersForm.patchValue({ searchTerm: '' });
  }
}
