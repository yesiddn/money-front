import { Component, inject, OnInit, signal } from '@angular/core';
import { RecordFilters } from "../../transactions/record-filters/record-filters";
import { FinancialTransactions } from './financial-transactions';
import { Record } from '../../models/record.intereface';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { TransactionIcon } from '../transaction-icon/transaction-icon';

@Component({
  selector: 'app-records',
  imports: [RecordFilters, DecimalPipe, DatePipe, TransactionIcon],
  templateUrl: './records.html',
})
export class Records implements OnInit {
  financialTransactions = inject(FinancialTransactions);
  messageService = inject(MessageService);

  transactions = signal<Record[]>([]);

  ngOnInit() {
    // this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar las transacciones.'});
    this.financialTransactions.getRecords()
      .subscribe({
        next: (data: Record[]) => {
          this.transactions.set(data);
        },
        error: (error) => {
          console.error('Error fetching records:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las transacciones.',
          });
        }
      });
  }
}
