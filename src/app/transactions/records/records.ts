import { Component, inject, OnInit, signal } from '@angular/core';
import { RecordFilters } from "../../transactions/record-filters/record-filters";
import { FinancialTransactions } from '../financial-transactions';
import { Record, RecordsResponse, TransactionFilters } from '../../models/record.intereface';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { TransactionIcon } from '../transaction-icon/transaction-icon';
import { CreateRecords } from "../manage-records/create-records/create-records";
import { EditRecords } from '../manage-records/edit-records/edit-records';
import { ManageRecordsDialogs } from '../manage-records/manage-records-dialogs';
import { ManageRecords } from '../manage-records/manage-records';

@Component({
  selector: 'app-records',
  imports: [RecordFilters, DecimalPipe, DatePipe, TransactionIcon, CreateRecords, EditRecords],
  templateUrl: './records.html',
})
export class Records implements OnInit {
  private manageRecordsDialogs = inject(ManageRecordsDialogs);
  private manageRecords = inject(ManageRecords);
  financialTransactions = inject(FinancialTransactions);
  messageService = inject(MessageService);

  limit = 20;
  offset = 0;
  transactions = signal<Record[]>([]);
  recordToEdit = signal<Record | null>(null);

  ngOnInit() {
    this.getTransactionIcon();
  }

  getTransactionIcon(filters?: TransactionFilters) {
    this.financialTransactions.getRecords(this.limit, this.offset, filters)
      .subscribe({
        next: (data: RecordsResponse) => {
          this.transactions.set(data.results);
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

  openEditRecordDialog(record: Record) {
    console.log('Editing record:', record);
    this.recordToEdit.set(record);
    this.manageRecordsDialogs.showEditRecordDialog();
  }

  handleNewRecord(newRecord: Record) {
    const orderedRecords = this.manageRecords.orderRecordsByDate([newRecord, ...this.transactions()]);
    this.transactions.set(orderedRecords);
  }

  handleUpdatedRecord(updatedRecord: Record) {
    const allRecords = this.transactions().map(record =>
      record.id === updatedRecord.id ? updatedRecord : record
    );
    
    const orderedRecords = this.manageRecords.orderRecordsByDate(allRecords);
    this.transactions.set(orderedRecords);
    this.recordToEdit.set(null);
  }

  applyFilters(filters: TransactionFilters) {
    this.getTransactionIcon(filters);
  }
}
