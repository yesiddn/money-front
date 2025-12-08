import { Component, inject, OnInit, signal } from '@angular/core';
import { RecordFilters } from "../../transactions/record-filters/record-filters";
import { FinancialTransactions } from './financial-transactions';
import { Record } from './record.intereface';
import { DecimalPipe } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-records',
  imports: [RecordFilters, DecimalPipe],
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

  getSpanClasses(typeRecord: 'expense' | 'income' | 'transfer' | 'investment'): string {
    switch (typeRecord) {
      case 'expense':
      case 'investment':
        return 'text-red-600 bg-red-500/20';
      case 'income':
        return 'text-green-600 bg-green-500/20';
      case 'transfer':
        return 'text-primary-600 bg-primary-500/20';
      default:
        return '';
    }
  }
}
