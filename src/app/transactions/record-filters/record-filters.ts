import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-record-filters',
  imports: [ReactiveFormsModule, InputTextModule, SelectModule, DatePickerModule, IconFieldModule, InputIconModule],
  templateUrl: './record-filters.html',
})
export class RecordFilters implements OnInit {
  private fb = inject(FormBuilder);
  filtersForm!: FormGroup;
  readonly recordTypes = [
    { label: 'Ingreso', value: 'income' },
    { label: 'Gasto', value: 'expense' },
    { label: 'Transferencia', value: 'transfer' },
  ];

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.filtersForm = this.fb.group({
      searchTerm: [''],
      typeRecord: [''],
      dateFrom: [''],
    });
  }

  applyFilters() {
    // Lógica para aplicar los filtros a los registros
  }
}
