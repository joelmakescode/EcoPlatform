import {Component, inject, Input, numberAttribute} from '@angular/core';
import {AmountPipe} from '../../pipes/amount.pipe';
import {NgClass} from '@angular/common';
import {StatusPipe} from '../../pipes/status.pipe';
import {TypePipe} from '../../pipes/type.pipe';
import {TransactionModalService} from '../../client/services/transactions/transaction-modal.service';
import {Transaction} from '../../types/transaction/transaction.interface';

@Component({
  selector: 'app-transactions-layout',
  standalone: true,
  imports: [
    AmountPipe,
    StatusPipe,
    TypePipe,
    NgClass,
  ],
  templateUrl: './transactions-layout.component.html',
  styleUrl: './transactions-layout.component.css',
})
export class TransactionsLayoutComponent {
  @Input() transactions!: Transaction[];
  @Input({transform: numberAttribute}) userId!: number;

  private transactionModalService: TransactionModalService = inject(TransactionModalService);

  trackByTxId(_: number, tx: Transaction): string {
    return tx.id;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
      case 'refund':
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
      case 'refund':
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

  openTransaction(transaction: Transaction): void {
    this.transactionModalService.open(transaction);
  }
}
