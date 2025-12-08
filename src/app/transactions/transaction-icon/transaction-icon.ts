import { Component, input } from '@angular/core';

@Component({
  selector: 'app-transaction-icon',
  imports: [],
  templateUrl: './transaction-icon.html',
})
export class TransactionIcon {
  typeRecord = input<'expense' | 'income' | 'transfer' | 'investment'>('expense');

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
