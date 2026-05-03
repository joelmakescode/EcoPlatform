import {Component, Input, numberAttribute} from '@angular/core';
import {AmountPipe} from '../../../../pipes/transactions/amount.pipe';
import {DatePipe, NgClass, NgForOf} from '@angular/common';
import {StatusPipe} from '../../../../pipes/transactions/status.pipe';
import {TypePipe} from '../../../../pipes/transactions/type.pipe';
import {Transaction} from '../../../../client/models/transactions/transaction.model';

@Component({
  selector: 'app-transactions-layout',
  standalone: true,
  imports: [
    AmountPipe,
    DatePipe,
    NgForOf,
    StatusPipe,
    TypePipe,
    NgClass
  ],
  templateUrl: './transactions-layout.component.html',
  styleUrl: './transactions-layout.component.css',
})
export class TransactionsLayoutComponent {
  @Input() transactions!: Transaction[];
  @Input({transform: numberAttribute}) userId!: number;

  trackByTxId(_: number, tx: Transaction) {
    return tx.id;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'status--success';
      case 'pending':
        return 'status--pending';
      case 'cancelled':
      case 'rejected':
        return 'status--error';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'assets/icon_success.png';
      case 'pending':
        return 'assets/icon_pending.png';
      case 'cancelled':
      case 'rejected':
        return 'assets/icon_error.png';
      default:
        return '';
    }
  }
}
